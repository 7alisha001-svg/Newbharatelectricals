import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ChevronLeft, 
  BookOpen, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Send, 
  CheckCircle2,
  Building,
  Wrench,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { blogPosts, BlogPost } from '../data/blogPosts';
import { SEO } from '../components/SEO';
import { trackLeadSubmission, trackCTAInteraction } from '../lib/analytics';
import { useMedia } from '../context/MediaContext';
import MediaImage from '../components/MediaImage';

export default function BlogPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { getMediaUrl } = useMedia();
  
  // List State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Industrial' | 'Commercial' | 'Residential' | 'Safety' | 'Solar'>('All');
  
  // Lead Submission State inside Article
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse Active Post
  const activePost = useMemo(() => {
    if (!slug) return null;
    return blogPosts.find(post => post.slug === slug) || null;
  }, [slug]);

  // Categories
  const categories: ('All' | 'Industrial' | 'Commercial' | 'Residential' | 'Safety' | 'Solar')[] = [
    'All', 'Industrial', 'Commercial', 'Residential', 'Safety', 'Solar'
  ];

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = (post.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (post.keywords || []).some(kw => (kw || '').toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  // Related Posts
  const relatedPosts = useMemo(() => {
    if (!activePost) return [];
    return blogPosts
      .filter(post => post.slug !== activePost.slug && (post.category === activePost.category || post.keywords.some(kw => activePost.keywords.includes(kw))))
      .slice(0, 3);
  }, [activePost]);

  // Handle Blog Lead Submission (CRO Phase 11)
  const handleBlogLead = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('blog-email') as HTMLInputElement).value;
    
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      trackLeadSubmission('Blog Newsletter/Inquiry', activePost?.title || 'General Blog');
      form.reset();
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  // Render Individual Article View
  if (activePost) {
    const breadcrumbs = [
      { name: 'Home', url: '/' },
      { name: 'Knowledge Hub', url: '/blog' },
      { name: activePost.title, url: `/blog/${activePost.slug}` }
    ];

    // Convert basic markdown-like content into rich styled elements
    const renderContent = (content: string) => {
      return content.split('\n\n').map((paragraph, index) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl md:text-2xl font-heading font-extrabold text-gray-900 mt-8 mb-4 tracking-tight flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="w-1.5 h-6 bg-brand-green rounded-full inline-block"></span>
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        // Checklist / Unordered lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const items = trimmed.split('\n').map(item => item.replace(/^[\*\-]\s+/, ''));
          return (
            <ul key={index} className="space-y-3.5 my-5 pl-1">
              {items.map((item, idx) => {
                const parts = item.split(':');
                if (parts.length > 1 && parts[0].startsWith('**') && parts[0].endsWith('**')) {
                  const title = parts[0].replace(/\*\*/g, '');
                  const desc = parts.slice(1).join(':');
                  return (
                    <li key={idx} className="flex items-start gap-3.5 text-gray-700 text-sm sm:text-base leading-relaxed">
                      <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-xs">✓</span>
                      <div>
                        <strong className="text-gray-900 font-extrabold">{title}:</strong>{desc}
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={idx} className="flex items-start gap-3.5 text-gray-700 text-sm sm:text-base leading-relaxed">
                    <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-xs">✓</span>
                    <span className="font-medium text-gray-800">{item}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Numbered lists
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split('\n').map(item => item.replace(/^\d+\.\s+/, ''));
          return (
            <ol key={index} className="space-y-4 my-6 list-decimal pl-5">
              {items.map((item, idx) => {
                const parts = item.split(':');
                if (parts.length > 1 && parts[0].startsWith('**') && parts[0].endsWith('**')) {
                  const title = parts[0].replace(/\*\*/g, '');
                  const desc = parts.slice(1).join(':');
                  return (
                    <li key={idx} className="text-gray-700 text-sm sm:text-base leading-relaxed pl-2 font-medium">
                      <strong className="text-gray-900 font-extrabold">{title}:</strong>{desc}
                    </li>
                  );
                }
                return (
                  <li key={idx} className="text-gray-700 text-sm sm:text-base leading-relaxed pl-2 font-medium">
                    {item}
                  </li>
                );
              })}
            </ol>
          );
        }

        // Table
        if (trimmed.startsWith('|')) {
          const lines = trimmed.split('\n').filter(line => line.trim().startsWith('|'));
          if (lines.length > 2) {
            const headers = lines[0].split('|').map(h => h.trim()).filter(h => h);
            const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(cell => cell));
            return (
              <div key={index} className="overflow-x-auto my-8 border border-gray-100 rounded-2xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {headers.map((h, hIdx) => (
                        <th key={hIdx} className="px-5 py-4 text-xs font-black uppercase tracking-wider text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-gray-50/50 transition">
                        {row.map((cell, cIdx) => {
                          const isBold = cell.startsWith('**') && cell.endsWith('**');
                          const text = cell.replace(/\*\*/g, '');
                          return (
                            <td key={cIdx} className="px-5 py-4 text-sm text-gray-800 leading-relaxed font-medium">
                              {isBold ? <strong className="text-gray-900 font-extrabold">{text}</strong> : text}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // Special Info Block or Callout
        if (trimmed.startsWith('*Need') || trimmed.startsWith('*Partner') || trimmed.startsWith('*Safeguard') || trimmed.startsWith('*Ensure') || trimmed.startsWith('*Improve')) {
          const linkMatch = trimmed.match(/\[(.*?)\]\((.*?)\)/);
          if (linkMatch) {
            const beforeLink = trimmed.split('[')[0].replace(/^\*\s*/, '').replace(/\*/g, '');
            const linkText = linkMatch[1];
            const linkUrl = linkMatch[2];
            return (
              <div key={index} className="my-8 p-6 md:p-8 rounded-3xl bg-brand-dark text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-brand-green/25">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="relative z-10 max-w-xl">
                  <div className="flex items-center gap-2 text-brand-lime text-xs font-black uppercase tracking-widest mb-2">
                    <Sparkles size={14} />
                    Project Consulting
                  </div>
                  <p className="text-sm sm:text-base text-gray-100 font-medium leading-relaxed">
                    {beforeLink}
                  </p>
                </div>
                <Link 
                  to={linkUrl}
                  onClick={() => trackCTAInteraction('email', `Blog Link CTA - ${activePost.slug}`)}
                  className="relative z-10 flex-shrink-0 px-6 py-3.5 bg-brand-green text-white font-bold rounded-xl text-sm uppercase tracking-wider hover:bg-brand-lime hover:text-brand-dark transition-all duration-300 shadow-md text-center cursor-pointer"
                >
                  {linkText}
                </Link>
              </div>
            );
          }
        }

        // Default Paragraph
        return (
          <p key={index} className="text-gray-800 text-base sm:text-lg leading-relaxed mb-6 font-medium">
            {trimmed.replace(/\*\*(.*?)\*\*/g, '$1')}
          </p>
        );
      });
    };

    return (
      <>
        <SEO 
          title={activePost.title}
          description={activePost.excerpt}
          keywords={activePost.keywords.join(', ')}
          ogType="article"
          ogImage={activePost.image}
          faqData={activePost.faqs}
          breadcrumbs={breadcrumbs}
        />

        <article className="w-full bg-slate-50 min-h-screen">
          {/* Article Banner Header */}
          <div className="relative w-full bg-brand-dark py-14 md:py-24 px-4 overflow-hidden border-b border-brand-green/10">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-transparent z-10"></div>
            <img 
              src={getMediaUrl(`blog_post_${blogPosts.findIndex(p => p.slug === activePost.slug) + 1}`, activePost.image)} 
              alt={activePost.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[1px]"
              loading="eager"
            />
            
            <div className="max-w-4xl mx-auto relative z-20 text-white">
              {/* Breadcrumbs for Navigation & SEO */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#D1D5DB] mb-6 uppercase tracking-widest">
                <Link to="/" className="hover:text-brand-green transition">Home</Link>
                <span>/</span>
                <Link to="/blog" className="hover:text-brand-green transition">Knowledge Hub</Link>
                <span>/</span>
                <span className="text-brand-lime truncate max-w-[200px] sm:max-w-xs">{activePost.category}</span>
              </nav>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-white mb-6 leading-tight">
                {activePost.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-gray-300 font-bold border-t border-white/10 pt-6">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-brand-green" />
                  <span>By {activePost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-brand-green" />
                  <span>{activePost.publishedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-brand-green" />
                  <span>{activePost.readTime}</span>
                </div>
                <div className="flex items-center gap-2 bg-brand-green/20 px-3 py-1 rounded-full text-brand-lime text-xs font-black uppercase tracking-wider">
                  <Tag size={12} />
                  <span>{activePost.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Body Grid */}
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
              
              {/* Left Content Area (Columns 1-8) */}
              <div className="lg:col-span-8 bg-white p-6 sm:p-10 md:p-14 rounded-3xl border border-gray-100 shadow-sm leading-relaxed">
                <div className="flex items-center gap-3 bg-brand-green/5 border border-brand-green/15 rounded-2xl p-4 sm:p-5 mb-8">
                  <Info size={24} className="text-brand-green flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
                    <strong>Quick Summary:</strong> {activePost.excerpt}
                  </p>
                </div>

                {/* Article Contents Rendered */}
                <div className="prose prose-lg max-w-none prose-slate">
                  {renderContent(activePost.content)}
                </div>

                {/* FAQ section inside Article (AEO & FAQ Schema Integration) */}
                {activePost.faqs && activePost.faqs.length > 0 && (
                  <div className="mt-12 pt-10 border-t border-gray-100">
                    <h4 className="text-2xl font-heading font-black text-gray-900 mb-6 flex items-center gap-2">
                      <ShieldCheck size={26} className="text-brand-green" />
                      Frequently Asked Questions (FAQs)
                    </h4>
                    <div className="space-y-6">
                      {activePost.faqs.map((faq, idx) => (
                        <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                          <h5 className="text-base sm:text-lg font-extrabold text-gray-900 mb-2 flex items-start gap-2">
                            <span className="text-brand-green font-black">Q:</span>
                            <span>{faq.question}</span>
                          </h5>
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-semibold pl-6">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords Cloud for Entity SEO */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                  <span className="text-xs font-black uppercase text-gray-400 self-center mr-2">Keywords:</span>
                  {activePost.keywords.map((kw, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] sm:text-xs px-3 py-1.5 rounded-full font-bold">
                      #{kw}
                    </span>
                  ))}
                </div>

                {/* Back to Blog List */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => navigate('/blog')}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 hover:text-brand-green hover:border-brand-green font-bold text-sm uppercase tracking-wider rounded-xl transition duration-300 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    Back to Knowledge Hub
                  </button>
                </div>
              </div>

              {/* Right Sidebar Area (Columns 9-12) */}
              <aside className="lg:col-span-4 space-y-8">
                
                {/* Related Posts Widget */}
                {relatedPosts.length > 0 && (
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h4 className="text-lg font-heading font-black text-gray-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                      <BookOpen size={18} className="text-brand-green" />
                      Related Articles
                    </h4>
                    <div className="space-y-5">
                      {relatedPosts.map(post => (
                        <Link 
                          to={`/blog/${post.slug}`} 
                          key={post.slug}
                          className="group block"
                        >
                          <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm font-extrabold text-gray-900 group-hover:text-brand-green transition leading-snug line-clamp-2">
                                {post.title}
                              </h5>
                              <span className="text-[10px] sm:text-xs text-gray-400 font-bold block mt-1">{post.publishedDate}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* CRO In-Context Lead Capture Card (Phase 11) */}
                <div className="bg-brand-dark p-6 sm:p-8 rounded-3xl border border-brand-green/10 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <h4 className="text-xl font-heading font-black text-white mb-3">Expert Solutions</h4>
                  <p className="text-xs sm:text-sm text-gray-300 font-semibold leading-relaxed mb-6">
                    Looking for Class-A certified electrical or solar engineering services in Uttar Pradesh or Delhi NCR? Request a callback from New Bharat Electricals.
                  </p>
                  
                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="bg-brand-green/20 border border-brand-green/30 rounded-2xl p-6 text-center"
                    >
                      <CheckCircle2 size={36} className="text-brand-lime mx-auto mb-2" />
                      <h5 className="text-base font-bold text-white">Inquiry Received</h5>
                      <p className="text-xs text-gray-200 mt-1">Our engineering team will call you within 2 business hours.</p>
                    </motion.div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleBlogLead}>
                      <div>
                        <label htmlFor="blog-email" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Email Address</label>
                        <input 
                          type="email" 
                          id="blog-email" 
                          name="blog-email"
                          required 
                          placeholder="name@company.com"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-brand-green font-medium"
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full px-5 py-3.5 bg-brand-green hover:bg-brand-lime hover:text-brand-dark text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        {isSubmitting ? 'Submitting...' : 'Request Consultation'}
                        <Send size={14} />
                      </button>
                    </form>
                  )}
                </div>

                {/* Quality & Trust Badges (EEAT Verification) */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-100">EEAT Certifications</h4>
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                      <Zap size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-900 block leading-tight">Class-A Certified Contractor</span>
                      <span className="text-[10px] text-gray-500 font-semibold">Licensed by State Licensing Board</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                      <Building size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-900 block leading-tight">Registered GSTIN & ESIC</span>
                      <span className="text-[10px] text-gray-500 font-semibold">Full statutory compliance guaranteed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                      <Wrench size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-900 block leading-tight">Advanced Test Equipment</span>
                      <span className="text-[10px] text-gray-500 font-semibold">Thermography & earth grid analyzers</span>
                    </div>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </article>
      </>
    );
  }

  // Render Category Hub & Article List View (/blog)
  return (
    <>
      <SEO 
        title="SEO & Industry Knowledge Hub | Solar, Inverters & Contracting"
        description="Explore in-depth electrical guides, preventive maintenance checklists, and solar power manuals curated by certified Class-A engineers at New Bharat Electricals."
        keywords="electrical contracting blog, industrial maintenance checklist, solar system sizing, generator installation, power distribution guides"
      />

      <div className="w-full bg-slate-50 min-h-screen pb-16">
        {/* Banner */}
        <section className="bg-brand-dark py-14 md:py-24 text-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <MediaImage 
              imageKey="blog_header_banner"
              defaultSrc="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1600&auto=format&fit=crop"
              alt="Blog Banner Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl -ml-20 -mt-20"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/20 text-brand-lime text-xs font-black uppercase tracking-wider mb-4 border border-brand-green/25">
              <Sparkles size={12} />
              Educational Resources
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-black text-white mb-6 tracking-tight">
              AEO & Industry Knowledge Hub
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
              Equipping businesses and households with professional-grade insights on electrical safety, solar integration, preventive audits, and statutory compliance.
            </p>
          </div>
        </section>

        {/* Content & Filters */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
          
          {/* Search and Filters Panel */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row gap-6 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search articles, checklists, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 focus:border-brand-green text-gray-800 text-sm font-semibold rounded-2xl focus:outline-none transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand-green text-white shadow-md shadow-brand-green/15'
                      : 'bg-slate-50 text-gray-600 border border-slate-100 hover:border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Articles Listing Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center bg-white border border-gray-100 p-12 rounded-3xl">
              <p className="text-gray-500 font-bold mb-4">No articles found matching your criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-6 py-3 bg-brand-green text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-brand-lime hover:text-brand-dark transition cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map((post, idx) => (
                <motion.article 
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-green transition-all group flex flex-col h-full"
                >
                  {/* Image Aspect Box */}
                  <div className="aspect-[16/10] w-full bg-slate-100 overflow-hidden relative">
                    <img 
                      src={getMediaUrl(`blog_post_${blogPosts.findIndex(p => p.slug === post.slug) + 1}`, post.image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-brand-dark/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-brand-lime text-[10px] font-black uppercase tracking-widest border border-white/5">
                      {post.category}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-extrabold mb-3">
                      <span className="flex items-center gap-1"><Calendar size={13} /> {post.publishedDate}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {post.readTime}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-heading font-black text-gray-900 leading-snug mb-3 group-hover:text-brand-green transition line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Read More Link (CRO) */}
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-brand-green font-extrabold text-xs sm:text-sm uppercase tracking-wider group-hover:text-brand-dark transition duration-300"
                      >
                        Read Full Article
                        <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
