import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';

const ContactSidebar: React.FC = () => {
  const contactLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="h-6 w-6 text-white" />,
      // Replace with your WhatsApp link (wa.me/number)
      href: 'https://wa.me/1234567890', 
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Email',
      icon: <Mail className="h-6 w-6 text-white" />,
      href: 'mailto:hello@example.com',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Call',
      icon: <Phone className="h-6 w-6 text-white" />,
      href: 'tel:+1234567890',
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
  ];

  return (
    // Container: Fixed to the right, vertically centered
    <div className="fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3 p-4">
      {contactLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            group relative flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2
            ${link.color}
          `}
          aria-label={link.name}
        >
          {/* Icon */}
          {link.icon}

          {/* Tooltip Label (slides out on hover) */}
          <span className="absolute right-14 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
};

export default ContactSidebar;