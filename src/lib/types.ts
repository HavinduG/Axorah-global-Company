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

export interface AcfData {
  header_logo: boolean;
  nav_bar: AcfNavBarItem[];
  button_start: string;
  button_start_link: string;
  button_signup: string;
  button_signup_link: string;
  hero_section_: AcfHeroSectionItem[];
  project_templates: AcfProjectTemplateItem[];
  customers_: AcfCustomerItem[];
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
