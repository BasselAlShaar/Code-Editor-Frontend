import React from "react";
import "./style.css";

const ContactUs = () => (
  <section className="contact-section">
    <h2 className="contact-title">Get in touch</h2>
    <form className="contact-form">
      <input className="contact-input" placeholder="Email address" type="email" />
      <textarea className="contact-textarea" placeholder="Your message…" />
      <button className="contact-submit-btn" type="submit">Send message</button>
    </form>
  </section>
);

export default ContactUs;
