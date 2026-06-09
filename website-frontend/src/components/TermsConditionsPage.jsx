"use client";
import React from 'react';
import RichTextContent from './RichTextContent';

export default function TermsConditionsPage({ data = {} }) {
  const hero = data.hero || {};
  const title = hero.pageTitle || 'Terms & Conditions';
  const breadcrumbLabel = hero.breadcrumbLabel || title;
  const content = data.content || '';

  return (
    <main className="tc-page">
      <section className="tc-hero">
        <div className="tc-hero-inner">
          <h1>{title}</h1>
          <nav className="tc-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span>{breadcrumbLabel}</span>
          </nav>
        </div>
      </section>

      <section className="tc-body">
        <div className="tc-body-inner">
          <RichTextContent value={content} className="tc-content" />
        </div>
      </section>

      <style jsx>{`
        .tc-page {
          width: 100%;
          background: #ffffff;
        }
        .tc-hero {
          width: 100%;
          background: #EEF0FA;
          padding: 80px 5% 60px;
          box-sizing: border-box;
        }
        .tc-hero-inner {
          max-width: 1200px;
          margin: 110px auto 0;
          text-align: center;
        }
        .tc-hero h1 {
          font-family: 'Marcellus', serif;
          font-size: clamp(34px, 3.4vw, 46px);
          font-weight: 400;
          color: #111111;
          margin: 0 0 18px;
          line-height: 1.18;
        }
        .tc-breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          color: #555555;
        }
        .tc-breadcrumb a {
          color: #3b5998;
          text-decoration: none;
        }
        .tc-breadcrumb a:hover {
          text-decoration: underline;
        }
        .tc-breadcrumb span:last-child {
          color: #111111;
        }
        .tc-body {
          width: 100%;
          padding: 70px 5% 90px;
        }
        .tc-body-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        :global(.tc-content h2),
        :global(.tc-content h3),
        :global(.tc-content h4) {
          font-family: 'Marcellus', serif;
          font-weight: 400;
          color: #111111;
          line-height: 1.3;
          margin: 38px 0 12px;
        }
        :global(.tc-content h2) {
          font-size: 28px;
        }
        :global(.tc-content h3) {
          font-size: 23px;
        }
        :global(.tc-content h4) {
          font-size: 19px;
        }
        :global(.tc-content > h2:first-child),
        :global(.tc-content > h3:first-child) {
          margin-top: 0;
        }
        :global(.tc-content p),
        :global(.tc-content li) {
          font-family: 'Lato', sans-serif;
          font-size: 16px;
          line-height: 1.85;
          color: #333333;
          margin: 0 0 16px;
        }
        :global(.tc-content ul),
        :global(.tc-content ol) {
          margin: 0 0 16px 22px;
          padding: 0;
        }
        :global(.tc-content a) {
          color: #3b5998;
          text-decoration: underline;
          word-break: break-word;
        }
        :global(.tc-content strong) {
          color: #111111;
          font-weight: 700;
        }
        @media (max-width: 767px) {
          .tc-hero {
            padding: 48px 6% 40px;
          }
          .tc-body {
            padding: 48px 6% 64px;
          }
          :global(.tc-content p),
          :global(.tc-content li) {
            font-size: 15px;
          }
          :global(.tc-content h3) {
            font-size: 21px;
          }
        }
      `}</style>
    </main>
  );
}
