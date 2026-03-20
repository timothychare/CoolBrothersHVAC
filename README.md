# Cool Brothers HVAC Website

A professional HVAC company website built with vanilla HTML, CSS, and JavaScript, featuring configuration-driven development and Segment analytics integration.

## 🔧 Configuration System

This website uses a centralized configuration system that allows you to easily manage all API keys, business information, and settings from a single location.

### Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit your configuration:**
   Open `js/config.js` and update the values in the `loadEnvironment()` method, or set up environment variables if using a build system.

3. **Add your Segment Analytics key:**
   Replace `paste_your_segment_key_here` with your actual Segment write key.

### Configuration Files

- **`.env.example`** - Template showing all available configuration options
- **`js/config.js`** - Main configuration file that loads environment variables
- **`js/main.js`** - Application logic that uses the configuration

## 📊 Analytics Integration

### Segment Analytics
The website includes comprehensive Segment analytics tracking:

- **Automatic tracking:** Page views, scroll depth, load times
- **Business events:** Phone calls, email clicks, form submissions  
- **User engagement:** Service inquiries, testimonial views, navigation
- **Error tracking:** Failed form submissions, broken links

### Analytics Events Tracked

| Event | Description | Properties |
|-------|-------------|------------|
| `CTA Clicked` | Call-to-action button clicks | location, action |
| `Phone Call Initiated` | Phone number clicks | location, phone, type |
| `Email Clicked` | Email address clicks | email, location |
| `Service Inquiry` | Service page interactions | service, action |
| `Form Submitted` | Contact form submissions | form_type, success |
| `Scroll Depth` | Page scroll engagement | depth, page |

### Setting Up Analytics

1. **Get your Segment write key:**
   - Sign up at [segment.com](https://segment.com)
   - Create a new source for your website
   - Copy the write key

2. **Update configuration:**
   ```javascript
   // In js/config.js, replace:
   SEGMENT_WRITE_KEY: 'paste_your_segment_key_here',
   // With your actual key:
   SEGMENT_WRITE_KEY: 'your_actual_segment_key_here',
   ```

3. **Test analytics:**
   - Open browser developer tools
   - Look for console messages confirming analytics initialization
   - Check Segment debugger for incoming events

## 🏢 Business Configuration

### Updating Business Information

All business information is centralized in the configuration system:

```javascript
// Business contact information
BUSINESS_NAME: 'Cool Brothers HVAC',
BUSINESS_EMAIL: 'info@coolbrothershvac.com',
BUSINESS_PHONE: '(555) 123-4567',
BUSINESS_ADDRESS: '123 Main St, Springfield, USA',

// Emergency contact
EMERGENCY_PHONE: '(555) 123-4567',

// Website settings
SITE_URL: 'https://coolbrothershvac.com',
SITE_LOGO: 'assets/images/logo.svg'
```

### Dynamic Content Population

The website automatically populates content from configuration:

- Page titles and meta descriptions
- Header and footer contact information
- Phone numbers with proper tel: links
- Email addresses with tracking
- Company name throughout the site

## 🎯 Event Tracking Usage

### Manual Event Tracking

Use the `ConfigUtils.trackEvent()` function to track custom events:

```javascript
// Track a service inquiry
ConfigUtils.trackEvent('Service Inquiry', {
    service: 'Air Conditioning',
    action: 'learn_more',
    location: 'homepage'
});

// Track form interactions
ConfigUtils.trackEvent('Form Submitted', {
    form_type: 'contact',
    success: true,
    fields: ['name', 'email', 'phone']
});
```

### Automatic Tracking

The following events are tracked automatically:

- Page loads and performance metrics
- Phone number and email clicks
- Newsletter signups
- Service page interactions
- Scroll depth and engagement

## 🚀 Development Setup

### File Structure
```
cool-brothers-hvac/
├── index.html              # Homepage with hero, services, testimonials
├── services.html           # Detailed service pages and pricing
├── about.html             # Company story, team, values
├── contact.html           # Contact form, FAQ, business info
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore file for security
├── css/
│   └── main.css           # Complete responsive stylesheet
├── js/
│   ├── config.js          # Configuration management system
│   ├── main.js            # Main application logic
│   └── contact.js         # Contact form and page interactions
├── assets/
│   └── images/
│       └── logo.svg       # Cool Brothers HVAC logo
└── README.md              # Complete documentation
```

### Quick Start Guide

1. **Clone or download the project files**

2. **Set up your Segment Analytics key:**
   ```javascript
   // Open: js/config.js
   // Find line ~25:
   SEGMENT_WRITE_KEY: 'paste_your_segment_key_here',
   // Replace with:
   SEGMENT_WRITE_KEY: 'your_actual_segment_write_key',
   ```

3. **Customize business information:**
   ```javascript
   // In js/config.js, update these values:
   BUSINESS_NAME: 'Cool Brothers HVAC',
   BUSINESS_EMAIL: 'info@coolbrothershvac.com',
   BUSINESS_PHONE: '(555) 123-4567',
   BUSINESS_ADDRESS: '123 Main St, Springfield, USA',
   ```

4. **Start a local development server:**
   ```bash
   # Option 1: Python
   python -m http.server 8000
   
   # Option 2: Node.js
   npx serve .
   
   # Option 3: PHP
   php -S localhost:8000
   
   # Option 4: VSCode Live Server extension
   # Right-click index.html → "Open with Live Server"
   ```

5. **Open your browser:**
   Navigate to `http://localhost:8000` and explore the site!

6. **Test the configuration system:**
   - Open browser Developer Tools (F12)
   - Check console for configuration messages
   - Test phone/email links to verify they update automatically
   - Try the contact form to see analytics events

### What's Included

✅ **Complete Website Structure**
- 4 fully functional HTML pages
- Professional responsive design
- Semantic HTML5 markup
- Accessibility features (ARIA labels, keyboard navigation)

✅ **Advanced CSS Framework**
- Modern CSS custom properties (variables)
- Mobile-first responsive design
- Professional HVAC color scheme
- Smooth animations and transitions
- Print styles and dark mode support

✅ **Configuration Management System**
- Centralized business information
- Environment variable support
- Feature flags and settings
- Development vs production modes

✅ **Comprehensive Analytics**
- Segment.js integration with error handling
- 15+ tracked events (calls, clicks, forms, scroll depth)
- Business-specific event properties  
- Development debugging tools

✅ **Interactive Features**
- Contact form with validation
- FAQ accordion functionality
- Testimonial carousel
- Mobile navigation menu
- Phone number formatting

✅ **Professional Business Features**
- Emergency contact prominence
- Service calculator framework
- Maintenance plan pricing
- Customer testimonials
- Team member profiles
- Company values and certifications

### Browser Compatibility

**Fully Supported:**
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

**Gracefully Degrades:**
- Older browsers receive basic functionality
- Reduced animations for performance
- Fallback fonts and safe defaults

## 🎨 Customization

### Changing Business Information

1. Update business details in `js/config.js`
2. Replace logo in `assets/images/logo.svg` 
3. Update favicon in `assets/images/favicon.ico`
4. Modify color scheme in CSS files
5. Update service offerings in HTML content

### Adding New Features

The configuration system supports feature flags:

```javascript
// Feature toggles
ENABLE_CHAT_WIDGET: false,
ENABLE_BOOKING_SYSTEM: false, 
ENABLE_PAYMENT_PROCESSING: false
```

Enable features by setting them to `true` and implementing the functionality.

## 📈 Performance Monitoring

### Key Metrics Tracked

- Page load times
- User engagement depth  
- Conversion funnel performance
- Error rates and types
- Device and browser analytics

### Optimization Tips

1. **Images**: Optimize all images for web (WebP format recommended)
2. **CSS**: Minify CSS files for production
3. **JavaScript**: Remove console logs and comments for production
4. **Analytics**: Review event volume to avoid analytics quotas

## 🔒 Security Notes

### Environment Variables

- Never commit `.env` files to version control
- Use different keys for development and production
- Regularly rotate API keys
- Monitor usage for unusual patterns

### Client-Side Limitations  

Remember that all configuration values are visible to users in the browser. Never include:

- Server-side API keys
- Database passwords
- Private authentication tokens
- Sensitive business information

## 📞 Support

For questions about this website setup:

1. Check browser console for error messages
2. Verify configuration values are properly set
3. Test analytics in Segment's debugger
4. Review this README for setup steps

## 📝 License

This project is intended for educational and business use. Replace all placeholder content with your actual business information before deploying to production.