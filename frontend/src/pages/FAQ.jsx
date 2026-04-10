import { useState } from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "Do I need a reservation?",
      answer: "Reservations are recommended for weekends and holidays. Walk-ins are welcome on weekdays, but we suggest booking in advance to guarantee your preferred table and time slot.",
    },
    {
      question: "What are your opening hours?",
      answer: "We are open from 12 PM to 11 PM every day, including public holidays. Last orders are taken at 10:30 PM. On Sundays we open at 11 AM for a special brunch menu.",
    },
    {
      question: "Do you offer home delivery?",
      answer: "Yes, we offer home delivery through Swiggy and Zomato.",
    },
    {
      question: "Is parking available?",
      answer: "Yes, we have free parking available for up to 50 vehicles. Valet parking is also available on Friday and Saturday evenings at a nominal charge.",
    },
    {
      question: "Can I host a private event or party?",
      answer: "Yes! We have a dedicated private dining area that can accommodate up to 80 guests. We offer customised menus, décor, and dedicated staff for weddings, corporate events, and birthday celebrations. Contact us to discuss your requirements.",
    },
    {
      question: "Is there a dress code?",
      answer: "We follow a smart casual dress code. We kindly ask guests to avoid wearing sportswear, flip-flops, or beachwear. For special events and fine dining evenings, formal attire is appreciated.",
    },
    {
      question: "Do you have a kids' menu?",
      answer: "Yes, we have a specially curated kids' menu with smaller portions and milder flavours. High chairs and colouring activity kits are available on request to make dining with little ones comfortable.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards, UPI, net banking, and cash. We also support popular wallets like Paytm and PhonePe. Split billing is available on request.",
    },
    {
      question: "Do you have outdoor seating?",
      answer: "Yes, we have a beautiful outdoor terrace that seats up to 30 guests. It is available weather permitting and can be reserved in advance for a more intimate dining experience under the stars.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="page">
      <h1>Frequently Asked Questions</h1>
      <p className="faq-subtitle">Everything you need to know about dining with us.</p>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            // Fix: use "faq-active" instead of "active" to avoid CSS conflict with navbar
            className={`faq-item ${activeIndex === index ? "faq-active" : ""}`}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h3>{faq.question}</h3>
              <span className="faq-icon">+</span>
            </div>

            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}