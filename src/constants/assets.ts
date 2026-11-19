/**
 * Shinosuke Fan Hub: Strongly Typed Asset Catalog
 * Extracted and downloaded directly from Google Stitch MCP.
 * All assets are saved locally in /public/images/ for high-performance offline loading.
 */

export interface ImageAsset {
  src: string;
  alt: string;
  remoteUrl: string;
  category: "hero" | "character" | "news" | "moment" | "location";
}

export const ASSETS = {
  // Home Page Assets
  home: {
    hero: {
      src: "/images/home-1-a-dynamic-high-energy-illustra.jpg",
      alt: "A dynamic, high-energy illustration of Shinnosuke Nohara (Shin-chan) in a playful 90s anime style.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJzfrVp_SX7TABT8zh_b-U5CRvaprVtjs6OZlRGWt9OHVO7680e69c0OvoUva4IGeSCdzSqnACeGkntX7uRgQNHmddUNt1I40ZEeYPvKpa8pvbcMFk4CVl-KcmJNOhZnSKwu0yyC9iC8kN6KkS__x-AmQhnWJSRnE7JbO5ZnaWMQNIBB5xeQhARW30QtxVAYPAEJdQB6ogtiPDP2Fm5nZbWfCJm0K5a0MQb8UZU92ArC1IVswgvn_vJw",
      category: "hero",
    },
    newsNoharaHouse: {
      src: "/images/home-2-a-comic-style-illustration-of-.jpg",
      alt: "A comic-style illustration of the Nohara family house with a giant Action Mask poster pinned to the roof.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6op4WHAzIDa3GuXAQTNPW97jgiWJmXH-Fe1zFwUquP7bX_hJCiA7K8GgzJi_S1JC7_YdSqHENyC1JIwJSQJ9RrU_9swFbnNFGRceLMd0jmrwv52iEluBDDgKj9wqLA2MGdpxtQiZQ6mENx-qdyWDts3cUpzE6ghD7zDCi5sdFfbRFrSD84MI38Oaxjc6zZwgEHr6xW7o3bgvssV7ndHNPnsHmHaylPUSusuY8TH3jVhM9UEbPMo1OcQ",
      category: "news",
    },
    newsChocobi: {
      src: "/images/home-3-a-highly-detailed-close-up-of-.jpg",
      alt: "A highly detailed close-up of a box of Chocobi chocolate star snacks with neon green packaging.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdA6Ki6Pga8AT3KMXo9dihfA18tU8v1zlbkDA4nubCMKnAndP402vlvG7OkmDYJMlshiguPoc3V8fRCMltSVg55qAb1zBrf8kAXPXoWuG1OA5RCwp0XRDYguCZC4INyX6zS67awFYV7NmqN3o-OnZu0T5yW2_53ECRMWzF2mJ-WDyTERg-lGElLz_GNumcllkggP4-ieT7TPRhEr6gUIHmJCZV36PlF_N90RG9U1AqWj9qgGlDg-uVLg",
      category: "news",
    },
    newsActionMask: {
      src: "/images/home-4-a-dynamic-action-packed-scene-.jpg",
      alt: "A dynamic action-packed scene of Action Mask striking a heroic pose on top of a skyscraper at sunset.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkBtD5OJDUPPivNHVQhJWMWpCVMguBWdG1_T2rSt-S30j8yBPZvMZbrZlLsHQbQuj9OfJmamdwwopgy-y0kOWCzP1EisgCRtyvBEKUDKCi7rM7HlJbqL1G9YjFmLlE8PfmQfJB7POX9TsQ6xX6JsBaTvaPMrZNkfUm4-LjnOGuJzgGOqv2pDM8VuFA9ZHr8UVJCFkdqpV3AXkHj9uBbJo4qFK5ROM_mhXQrrarrW4vnhyz8H3i77sYOQ",
      category: "news",
    },
  },

  // Kasukabe Squad & Nohara Family Characters
  characters: {
    shinChan: {
      src: "/images/squad-1-a-playful-and-mischievous-5-ye.jpg",
      alt: "A playful and mischievous 5-year-old Shinnosuke Nohara wearing his iconic red shirt and yellow shorts.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn52cwgQ0ur2Z40p0lP3HeZVq5tw6Tse9NLaGHu944WgfDubI61BZAnCHGjPQSdOPoFGa3CGZdre1uBSDe_y0CfEcrCq-CX-JjmuT1_I4S0pd6erpDD__gfktErRvUb-hMa2sE63eaL-VlUJZxVplQmwTBjrTim8KsQbuBHONyHj8OrK9Fgtaf6FH-OIAY4L3gHyf29WFP1d5hX4sWaUVikPWhBeRWCN8-pZ57MXMk5-k7y-Hedch9hA",
      category: "character",
    },
    kazama: {
      src: "/images/squad-2-a-refined-well-dressed-5-year-.jpg",
      alt: "A refined, well-dressed Toru Kazama in light blue polo shirt and smart shorts.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrGWQQsBbYAYdjt5lRlVu2LWkXAmEPpZADBNpySC6sz_NKWdPGrHNqPxyXkVn8X-CIoyfhtCECl2jrL8UcpJr_NnEGoghMQPQIG_e4wSmvnUH4qh9FgUKqxTdAvxja4-V24XifG2EP59LgPDNk8flRQDLj8zMq3ZUNGPlhGBqpO6Ah_wngTRPSRrZh181y1pu3vamL28Gh3Jk27-HICsIDFrQadiHULMrmgWntRtkBSl7aNw8_hjPSHw",
      category: "character",
    },
    nene: {
      src: "/images/squad-3-a-young-girl-with-pink-pigtail.jpg",
      alt: "Nene Sakurada with pink pigtails and a bright pink dress holding her plush bunny toy.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBruk2r8unyhkOH-zxKWdJgOTh0DooN-5fzydo1zGZFPQmS9odYxvkl2vcrnYLAjqa-ftOqX7Va6vpeJ5ggm_68HwEZQQVBnFfYkAcAkMj_JnRR3ZEpFsGBhFwrJZJdxh_AN5JFiJIiAywhPwWBTiXL_H8eQRk6UXwtss5T0-IWRgW8PwkU6w8X9V8D3yh0iMi_GF-l5j1rTEwUJk54NC3M6u4UIKA7lVUeq5GdexmiB9Ifc-G10vbVxA",
      category: "character",
    },
    masao: {
      src: "/images/squad-4-a-timid-little-boy-with-a-roun.jpg",
      alt: "Timid Masao Sato with an onigiri shaved head and kindergarten green uniform.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLYZsEvmVzXvDbs01NFzJRop5xO1jl_g9E-O-PXqL-dVk2TETT9dQz47bSCobPE21IB9S3OzXMcTO9oEDakh7qGa7jVfG6L1rOhnlw_ZECh_iqdrAzBKqPTC9lR1xdiqbKpjtQvCNfPhVrPGLnd7URIg8AB2Imbbb6f20HOhP6T3kNDH7TogBItnwnyJP384nG0468qjFOmBWxAGj69gzFmn2zplF2A9-WcRza_ElIZ1xbtCl3V1TEEQ",
      category: "character",
    },
    boChan: {
      src: "/images/squad-5-a-calm-stoic-little-boy-with-a.jpg",
      alt: "Bo-chan, calm and stoic with his signature drop of mucus, surrounded by favorite rocks.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYa4K50ah0XIYWtoUIo9IUsW4gHJBGv8GP4NDkVKLGjicwLscOvm753iTT_95rpBABHmiAfjRGuv38X434zSkUNCUlB5KHw4cS168h1lbPDeKfu1ocLd2gFR8-Hxhdr5CzoJ0zqjDPnXaU6z4Aa4OcPjOOBkoTmLcWgvJlNAcgSFUnA0aBaFPNhLZ1-t3nOJII1etP1qxYfrDYqYsgRpouCbB_C9lrRxmrWVtC5MihHe1e3k9JUSyusQ",
      category: "character",
    },
    shiro: {
      src: "/images/squad-6-a-fluffy-cloud-like-white-dog-.jpg",
      alt: "Shiro, the fluffy cloud-like white dog curled up into a ball on the grass.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDj67wkH2gIOrpyKzQ8904eDiDwqlA0UY0RCRDF1tYRNEHkCXGit6Kvf6ukI_75PobDv7o_JIY9qJluF4jF2C2qqJfLGDoDU9i0Du88T2JeGs3d3q__xRxwGzRcfAeyqEJbNxVEoq8iOfBXo9H0_mIEVIVmWe5s2AbjLwDaAlPhyuEOFCB9qAGcnd_rLGEkZVonmJlEzg0PwWqkKAOVmzoWcAGUmXAkD2bHbLFI1APkZ7DqKqO1kjnaIQ",
      category: "character",
    },
    misae: {
      src: "/images/squad-7-a-tall-japanese-woman-with-wav.jpg",
      alt: "Misae Nohara, waving brown hair in kitchen chasing Shin-chan (Mischief Manager Level 100).",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiV-lYnkGXx_CeUbvKiD2q0ko35XS47B--mhDufPTWSG6aKFvUXmlc4HQwm6fW8TMfhYDpEtOPCoM9XAumma68qjIUiro7dZwy2RQjddc4gFg4NuhpjlcdDMUOEV2SBzQkZxFcZVXiAbmVoyHH7e3Mod6RPY8IF7AWCotTg9oAYwiz4STStAJxnsEh9r4GVA83NuFDxIEUs0oGWXZjGtW-TjNoUkFJ9CSTIvoPpt-tuJV6WwiCCpWwGw",
      category: "character",
    },
    hiroshi: {
      src: "/images/squad-8-a-tired-salaryman-with-stubble.jpg",
      alt: "Hiroshi Nohara, hardworking salaryman relaxing with a beer after work.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCklwgvdSRgoMtdfTzRxotO0JxAErQVMPz1GXWbCQipsI6WlTH7-1LrdF_w-Bfo1AXF1Y8HV1Dg7IgmA7Zl1xL-SOlsvmtzppLqofIPxf260RNjn9aLtC318ynhaFgCPesAscApr9-a_v5KE-rpfSlzhZL5XWA3ubzCuHRMcNrSaWohLJmd9FYSesU4e61IDqmT5a5QnGinEtZbg3rU3Z6r1MHkqw1N0dPBrFezY1ODiVsS9imfNgNdLQ",
      category: "character",
    },
    himawari: {
      src: "/images/squad-9-a-cute-baby-girl-with-curly-or.jpg",
      alt: "Himawari Nohara, cute baby girl with curly orange hair crawling toward shiny jewelry.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCODbOtmo6F6X7esKDdwtdir1YQoU3N-fGwtLnMwYF_7jhXb17Lifg2SYjmA5-rDWMk9cu8agfMx0_RIJLx11YHVCkc-yhaZxcPcngA5MD4K4AVh0FJbPGu8NauZDmejfQM6hbbc-Uvioda64DCgHYfp4xk-t3_T0oYJ4r7jpaErr1bb7vezwyN9e1RQt3_-NyxxBrI6FY4GTrelfKEy0mUjkcupUd1fdWgofp-fytE9xqV_ohkTQZwgQ",
      category: "character",
    },
  },

  // Gallery Moments
  gallery: [
    {
      id: "butt-dance",
      title: "Iconic Butt Dance",
      category: "giggles",
      src: "/images/butt-dance.gif",
      alt: "Vibrant 90s anime style animation of Shin-chan performing his iconic buri-buri butt dance.",
      remoteUrl: "https://media1.tenor.com/m/vKLxyy7y8T4AAAAC/shin-chan-anime.gif",
      tag: "Giggles",
      tagColor: "tertiary-fixed",
    },
    {
      id: "action-mask-hero",
      title: "Heroic Action Beam",
      category: "action-mask",
      src: "/images/gallery-2-a-dynamic-action-scene-in-a-no.jpg",
      alt: "Action Mask striking a heroic pose with Shin-chan in a cape in front of purple explosion.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHGGMfSf5LJNcz4C3uB3KnrYvqEr-H2XkOvBCNHdl1TWMpcqTwN159T1mzDh779wKVCm3JXKrE_Hj1BMTT44Sl0_cMS-9xzDzuBV6PfHsGFj5cf8_KoCzMPF-OShh1G7PqUEWeX_s6QbmBDmhdTOTFy-DDPuwPo_SO1UbKD35ouwjk9N_pruYxWurdN_RFj05HWs6Wuw_XHn5rtFuZGi9MePBJcVoFIota5OoUyssyDKw6ytDsJRvlPg",
      tag: "Action Mask",
      tagColor: "secondary-container",
    },
    {
      id: "misae-anger",
      title: "Misae's Throbbing Anger",
      category: "trouble",
      src: "/images/gallery-3-a-humorous-90s-animation-cel-s.jpg",
      alt: "Misae with comically enlarged anger vein on forehead while Shin-chan walks away whistling.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNUJy0Qu0mcQzydpuycabQ1pr0r0MzXsHuQym_i1AQ1TXN3cvS7KukPt69-0AwWuYpouG8VnuKd8A9JQ4fQB9nEpVZzltKOWlHdCiHaCNENUqi8X29JX-aMojfsGkP79mXDyHlv0Lv5ws4qmM4GcPILtUiiJAx2wJsHkUesCXR9X0Fy_1uvkIS3B1S4w-h0QVtSiiOL3ECaQ-7nfqzG9rYi9HdY6kjXM29934aIHTVBzJjQDo163NQ1A",
      tag: "Trouble",
      tagColor: "primary-fixed",
    },
    {
      id: "shiro-confused",
      title: "Shiro's Cotton Candy Confusion",
      category: "giggles",
      src: "/images/gallery-4-a-detailed-90s-anime-illustrat.jpg",
      alt: "Shiro looking confused with his head tilted on a sunny lawn.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4WGuF53-407Aq9a9EEMjieGWbqeNaL_DDovkvKtN8Jvc0S_RdcKmrcKKo4z-8F-rJtm8-LmRG0z44h8yeZQlftc5IQ7NRUXrI6hWtzVFP5UW84n89cNhU_a5FDaDMDlqvxIBiR6UCUlI4DZnLV8l8tgAkE9ADIh4SzJfVlfedFCACxSwQksjSK2jqJLzx8XC0o6XSv5TkGgJWvF761g6X2uuY6WnR4OR5Jy3XJHAxiaaS_BIvX_U-EQ",
      tag: "Giggles",
      tagColor: "tertiary-fixed",
    },
    {
      id: "squad-pose",
      title: "Kasukabe Defense Group Assembled",
      category: "action-mask",
      src: "/images/gallery-5-the-kasukabe-defense-group-sta.jpg",
      alt: "The Kasukabe Defense Group standing together in a classic team pose on the school playground.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN1zcBjFtXFQ5raaJSJ5LguJ3VemYwA4bDjbRCoIUrmnWUl824O2JN-aIDhfBsFgP5kI2VQcJn7jeb2WuxCthYBS5u_sxGrxQspMN1iHMWO-sGCRIbYRClcOpvy47eELj1Hx49Y6ZA3LNfqOBepSXuQ13xGW9sYRNVLTVTOaWVwar2b6aUWiefxDUh2-vazj1F6RT6aJW0ZJ6ltN6tuqmSw3cJtZewY91rY-UwpjGkbleBKz1B26sQrg",
      tag: "Action Mask",
      tagColor: "secondary-container",
    },
    {
      id: "chocobi-feast",
      title: "Chocobi Mega Feast",
      category: "trouble",
      src: "/images/gallery-6-a-high-contrast-pop-art-style-.jpg",
      alt: "High contrast pop-art style close-up of Shin-chan about to eat a Chocobi star.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlvoRwWqHq6lJ6tFl8QMSOcml6L3oxOMlN9mQShBxKQO3a3UO_9TXdDksJB8kVtG17XTeG6Vly_oE1oqgdEss4mxx3Z4pMMxuTRVns0m28GkTdf55379R0J4BKn9Ms0Sq71kyk_Jt_EK45daTPE4DTJlbYSfGfx_M6yUgT57KEVVicgeEgXAqNWTwiWSkoGjiZ2t8PtK7o1xE4PVRjOQgAvR4DluxWIkbkkw-w5IlGoZqCZHzxjtjFNQ",
      tag: "Trouble",
      tagColor: "primary-fixed",
    },
  ],

  // Kasukabe City Landmarks
  locations: {
    cityPanorama: {
      src: "/images/city-1-a-vibrant-digital-illustration.jpg",
      alt: "A vibrant digital illustration of Kasukabe City with suburban houses and fluffy cartoon clouds.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVXIjw1sS1BU_XnCRqtqCHKyQNb_7avJpITJu4L8A8RjCYHgaZUfk715Ledglhb3CPfqWqBqZS1qX1gm-9Y-kG_12MCqi-yhSs1aLVBOCNy56n-f14nFQQFU7Cdlj2tZw3LlzvHsgdvDBhB8jXdLL1azgQKenwjdKDwa-mq8caFdDZRXrx63cu_iuMO0VbJV0vFaFApjtyXKh9OxVvLxjr1R2YDMp1iaeg3iNN2ctij91SFMgMSs7qRg",
      category: "location",
    },
    noharaResidence: {
      src: "/images/city-2-a-stylized-2d-drawing-of-the-n.jpg",
      alt: "A stylized 2D drawing of the Nohara family house with red roof and dog house.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzU0HnzblnJh983GOhGcBf5wMO-DtIHi9K4uXzAPhLImNitW0d2DsGHrdN4DlOiktXOG1M_nT7_EojE8BGy2U_uyW-cnGU9RWWHGqLJ9TmAblACtNsLuRSJsXL7EeeU_FP2W23vy8OUzk76VzEsnjCtn8SrWtuJs5RwL-KekYyzZXpLFCla5VEpwmPT-vb18law9sT5_y6Id_PMDJXVZYZtSh_DcBaJYy5y3jCV_GpauxgABhkB4rGfA",
      category: "location",
    },
    actionMart: {
      src: "/images/city-3-a-fun-cartoon-depiction-of-a-j.jpg",
      alt: "A fun cartoon depiction of Action Mart / Satou Kokonoe supermarket with yellow and red signage.",
      remoteUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZz64meADwCivF0MmnEUie_erupbnDpznpXMulyUyKOoe0tQYxzIDftbM_1yPaPqVUHdHmBOr2-CnAogEPEVMKjdQ0t4nXP8Lx1Bs5pdEwrqoS259kupskUV4XRmokBMlK_GiZVtakj8aORC200TD_tI0WKClOvZClI5ru2RTJ4ALK8NKd7KfiwA7dG7QdHYtCqTxTqd1N6v9cTEcUjZhe16W40DD0mqI3VUQzEGcVx9Ggza0F8D6kow",
      category: "location",
    },
  },
} as const;

