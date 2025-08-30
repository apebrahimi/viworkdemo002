// Analytics helper for Plausible/GA4 event tracking
// No-op if analytics key not present

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (
  eventName: string,
  properties?: Record<string, string>
) => {
  // Plausible
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties);
  }
};

// Predefined event tracking functions
export const analytics = {
  // Hero events
  heroCtaDemoClick: () => trackEvent('hero_cta_demo_click'),
  heroCtaSalesClick: () => trackEvent('hero_cta_sales_click'),

  // Platform compatibility
  compatSectionView: () => trackEvent('compat_section_view'),

  // Security highlights
  securityHighlightsReadMoreClick: () => trackEvent('security_highlights_read_more_click'),

  // Why vs alternatives
  whyVsAlternativesOpen: () => trackEvent('why_vs_alternatives_open'),

  // FAQ
  faqItemOpen: (questionId: string) => trackEvent('faq_item_open', { question_id: questionId }),

  // Support
  supportPortalClick: () => trackEvent('support_portal_click'),
  supportPlansClick: () => trackEvent('support_plans_click'),

  // Pricing
  pricingTeaserClick: () => trackEvent('pricing_teaser_click'),
  ndaRequestClick: () => trackEvent('nda_request_click'),

  // Product events
  productIntroView: () => trackEvent('product_intro_view'),
  secureWorkspacesView: () => trackEvent('secure_workspaces_view'),
  capabilityItemExpand: (capabilityId: string) => trackEvent('capability_item_expand', { capability_id: capabilityId }),
  integrationsCtaClick: () => trackEvent('integrations_cta_click'),
  pricingCtaClick: () => trackEvent('pricing_cta_click'),
  comparisonRowExpand: (competitorId: string) => trackEvent('comparison_row_expand', { competitor_id: competitorId }),

  // Solutions events
  solutionsIntroView: () => trackEvent('solutions_intro_view'),
  industryCardClick: (industryId: string) => trackEvent('industry_card_click', { industry_id: industryId }),
  playbookExpand: (playbookId: string) => trackEvent('playbook_expand', { playbook_id: playbookId }),
  workspacesSectionView: () => trackEvent('workspaces_section_view'),
  blueprintCtaClick: () => trackEvent('blueprint_cta_click'),
  supportOnboardingCtaClick: () => trackEvent('support_onboarding_cta_click'),

  // Security events
  securityIntroView: () => trackEvent('security_intro_view'),
  controlsOverviewExpand: (controlId: string) => trackEvent('controls_overview_expand', { control_id: controlId }),
  privacySectionView: () => trackEvent('privacy_section_view'),
  complianceSectionView: () => trackEvent('compliance_section_view'),

  // Support events
  supportPlansView: () => trackEvent('support_plans_view'),
  severityMatrixExpand: () => trackEvent('severity_matrix_expand'),
  onboardingCtaClick: () => trackEvent('onboarding_cta_click'),
  supportContactSubmit: () => trackEvent('support_contact_submit'),

  // Portal events
  portalLoginSuccess: () => trackEvent('portal_login_success'),
  ticketCreated: () => trackEvent('ticket_created'),
  ticketReplyPosted: () => trackEvent('ticket_reply_posted'),
  slaReportDownloaded: () => trackEvent('sla_report_downloaded'),
  downloadClientClicked: () => trackEvent('download_client_clicked'),
  renewalCtaClicked: () => trackEvent('renewal_cta_clicked'),
  inviteUserSent: () => trackEvent('invite_user_sent'),
};
