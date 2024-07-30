import React from "react";
import "./style.css";

const ContactUs = () => {
  return (
    <div className="Contact-Container">
      <form className="Contact-Form">
        <h2>Contact Us</h2>
        <input placeHolder="email" type="email" className="Contact-Email" />
        <textarea placeholder="message" name="" className="Contact-Text" />
        <button className="Contact-Button">Submit</button>
      </form>
    </div>
  );
};

export default ContactUs;
