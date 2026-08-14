const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const form = e.currentTarget;

  setIsSubmitting(true);
  setError('');

  const name = (
    form.elements.namedItem('name') as HTMLInputElement
  ).value.trim();

  const phone = (
    form.elements.namedItem('phone') as HTMLInputElement
  ).value.trim();

  const email = (
    form.elements.namedItem('email') as HTMLInputElement
  ).value.trim();

  const company = (
    form.elements.namedItem('company') as HTMLInputElement
  ).value.trim();

  const inquiryType = (
    form.elements.namedItem('inquiry-type') as HTMLSelectElement
  ).value;

  const message = (
    form.elements.namedItem('message') as HTMLTextAreaElement
  ).value.trim();

  if (!name) {
    setError('Full name is required.');
    setIsSubmitting(false);
    return;
  }

  if (!phone) {
    setError('Phone number is required.');
    setIsSubmitting(false);
    return;
  }

  const phoneClean = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;

  if (!phoneRegex.test(phone) || phoneClean.length < 10) {
    setError(
      'Please enter a valid phone number (minimum 10 digits).'
    );
    setIsSubmitting(false);
    return;
  }

  if (!email) {
    setError('Email address is required.');
    setIsSubmitting(false);
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address.');
    setIsSubmitting(false);
    return;
  }

  try {
    const payloadData = {
      email,
      company,
      status: 'New',
      is_contact: true,
      message,
    };

    // Save lead to Supabase
    // IMPORTANT: .select() intentionally removed.
    const { error: dbError } = await supabaseAnon
      .from('inquiries')
      .insert([
        {
          name,
          phone,
          inquiry_type: inquiryType,
          message: JSON.stringify(payloadData),
        },
      ]);

    if (dbError) {
      console.error('Supabase inquiry insert error:', dbError);
      throw dbError;
    }

    // Send inquiry details to email API
    const response = await fetch('/api/inquiries/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: name,
        emailAddress: email,
        phoneNumber: phone,
        companyName: company || undefined,
        subject: inquiryType,
        message,
        pageUrl: window.location.href,
        dateTime: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
        source: 'Contact Page',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || 'Failed to deliver email.'
      );
    }

    setSubmitted(true);
    trackLeadSubmission('Contact Form', inquiryType);

    form.reset();

    setTimeout(() => {
      setSubmitted(false);
    }, 10000);
  } catch (err: any) {
    console.error('Error submitting inquiry:', err);

    setError(
      err.message ||
        'There was a problem submitting your inquiry. Please try again.'
    );
  } finally {
    setIsSubmitting(false);
  }
};