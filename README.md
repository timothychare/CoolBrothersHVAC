# Cool Brothers HVAC Website

A professional HVAC company website built with vanilla HTML, CSS, and JavaScript.

## � Quick Setup

### Quick Start

1. **Clone or download the project files**

2. **Customize business information:**

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
│   ├── main.js            # Main application logic
│   └── contact.js         # Contact form and page interactions
├── assets/
│   └── images/
│       └── logo.svg       # Cool Brothers HVAC logo
└── README.md              # Complete documentation
```

### Quick Start Guide

1. **Clone or download the project files**

2. **Customize business information:**
   Edit the HTML files directly to update business details:
   - Company name: "Cool Brothers HVAC" 
   - Phone: "(555) 123-4567"
   - Email: "info@coolbrothershvac.com"
   - Address: "123 Main St, Springfield, USA"

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

6. **Test the website:**
   - Open browser Developer Tools (F12)
   - Test phone/email links to verify they work properly
   - Try the contact form

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

1. Edit HTML files directly to update business details
2. Replace logo in `assets/images/logo.svg` 
3. Update favicon in `assets/images/favicon.ico`
4. Modify color scheme in CSS files
5. Update service offerings in HTML content

### Adding New Features

To add new features, modify the HTML, CSS, and JavaScript files directly as needed.

## 📈 Performance Monitoring

### Key Metrics Tracked

- Page load times
- User engagement depth  
- Conversion funnel performance
- Error rates and types
- Device and browser information

### Optimization Tips

1. **Images**: Optimize all images for web (WebP format recommended)
2. **CSS**: Minify CSS files for production
3. **JavaScript**: Remove console logs and comments for production

## 🔒 Security Notes

### Environment Variables

- Never commit `.env` files to version control
- Use different keys for development and production
- Regularly rotate API keys
- Monitor usage for unusual patterns

### Client-Side Limitations  

Remember to keep sensitive information secure. Never include in client-side code:

- Server-side API keys
- Database passwords 
- Private authentication tokens

## 📞 Support

For questions about this website setup:

1. Check browser console for error messages
2. Verify business contact information is displaying correctly
3. Review this README for setup steps

## 📝 License

This project is intended for educational and business use. Replace all placeholder content with your actual business information before deploying to production.