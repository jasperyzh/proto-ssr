import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

export default function SocialShare({ url, title, description }) {
  return (
    <div className="social-share mt-4">
      <p className="mb-2">Share your attendance:</p>
      <div className="d-flex gap-2">
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        
        <LinkedinShareButton url={url} title={title} summary={description}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        
        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
}