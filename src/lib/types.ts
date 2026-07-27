export interface AcfNavBarItem {
  acf_fc_layout: string;
  menu_page_name: string;
  page_link: string;
}

export interface AcfHeroSectionItem {
  acf_fc_layout: string;
  main_title: string;
  sub_hero_title: string;
  "button_-start": string;
  "button_-start_link": string;
  button_expert_: string;
  button_expert_link: string;
}

export interface AcfProjectTemplateItem {
  acf_fc_layout: string;
  project_view: {
    ID: number;
    id: number;
    title: string;
    filename: string;
    filesize: number;
    url: string;
    link: string;
    alt: string;
    author: string;
    description: string;
    caption: string;
    name: string;
    status: string;
    uploaded_to: number;
    date: string;
    modified: string;
    menu_order: number;
    mime_type: string;
    type: string;
    subtype: string;
    icon: string;
    width: number;
    height: number;
    sizes: {
      thumbnail: string;
      "thumbnail-width": number;
      "thumbnail-height": number;
      medium: string;
      "medium-width": number;
      "medium-height": number;
      medium_large: string;
      "medium_large-width": number;
      "medium_large-height": number;
      large: string;
      "large-width": number;
      "large-height": number;
      "1536x1536": string;
      "1536x1536-width": number;
      "1536x1536-height": number;
      "2048x2048": string;
      "2048x2048-width": number;
      "2048x2048-height": number;
    };
  };
}

export interface AcfCustomerItem {
  acf_fc_layout: string;
  client_brand_name: string;
}

export interface AcfWorkTab {
  acf_fc_layout: string;
  icon_image: {
    url: string;
    alt: string;
  };
  work_description: string;
  project_short_video: {
    url: string;
  };
}

export interface AcfAboutImageItem {
  acf_fc_layout: string;
  about_image: {
    url: string;
    mime_type: string;
  };
  image_title: string;
  image_descripation: string;
}

export interface AcfContactDetail {
  acf_fc_layout: string;
  contact_detail_title: string;
  contact_image: {
    url: string;
    alt?: string;
  };
  contact_details_: string;
}

export interface AcfSocialMedia {
  acf_fc_layout: string;
  social_media_icon: {
    url: string;
    alt?: string;
  };
  social_media_link: string;
}

export interface AcfFeedbackItem {
  acf_fc_layout: string;
  client_image: {
    url: string;
    alt?: string;
  };
  client_name: string;
  client_position: string;
  client_feedback: string;
}

export interface AcfFooterPageLink {
  acf_fc_layout: string;
  page_name: string;
  page_link: string;
}

export interface AcfSupportLink {
  acf_fc_layout: string;
  support_link_name: string;
  support_link_url: string;
}

export interface AcfServiceItem {
  acf_fc_layout: string;
  service_title: string;
  service_short_description: string;
  service_description: string; // HTML string
}

export interface AcfData {
  header_logo: false | string | { url: string; alt?: string; [key: string]: unknown };
  nav_bar: AcfNavBarItem[];
  button_start: string;
  button_start_link: string;
  button_signup: string;
  button_signup_link: string;
  hero_section_: AcfHeroSectionItem[];
  project_templates: AcfProjectTemplateItem[];
  customers_: AcfCustomerItem[];
  work_main_title: string;
  works_tabs: AcfWorkTab[];
  about_main_title: string;
  about_section_title: string;
  about_small_description: string;
  button_about: string;
  button_link_about: string;
  about_small_images_: AcfAboutImageItem[];

  // Feedback fields
  feed_back_title: string;
  feed_back_sub_title: string;
  feedbacks: AcfFeedbackItem[];

  // Footer fields
  footer_logo: false | string | { url: string; alt?: string; [key: string]: unknown };
  social_media: AcfSocialMedia[];
  contact_details: AcfContactDetail[];
  footer_page_links: AcfFooterPageLink[];
  support_links: AcfSupportLink[];

  // Capabilities / Services
  section_main_title: string;
  capabilities_description: string;
  services: AcfServiceItem[];

  // Short CTA Section
  short_section_title: string;
  short_section_description?: string;
  button_sub: string;
  button_sub_link: string;
}

export interface WordPressPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf: AcfData;
}

// Project specific types
export interface ProjectImageSize {
  url: string;
  width: number;
  height: number;
}

export interface ProjectImageSizes {
  thumbnail: string;
  medium: string;
  medium_large: string;
  large: string;
  "1536x1536": string;
  "2048x2048": string;
  [key: string]: string | number; // For other dynamic sizes like "thumbnail-width"
}

export interface ProjectImage {
  ID: number;
  id: number;
  title: string;
  filename: string;
  filesize: number;
  url: string;
  link: string;
  alt: string;
  name: string;
  width: number;
  height: number;
  sizes: ProjectImageSizes;
}

export interface ProjectAcf {
  project_name: string;
  project_image: ProjectImage;
  project_gallery: ProjectImage[];
  project_description: string;
}

export interface WordPressProject {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  acf: ProjectAcf;
}
