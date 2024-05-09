export const RESOURCE_BASE = "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/";
export const STAGE_RESOURCE_BASE = "https://d33r26vb2a4c28.cloudfront.net/photoadking-test/";

export const environment = {
      production: true,
      ENV: {
        "development": true,
        'designer': false,
        "enablenalytics": false,
        "env_mode": "staging",
        "enable_video_price": true,
        "environment": 'staging'
      },
      DELETED_CATEGORY: [
        {
          // this is redirect on facebook cover category
          deletedList: ["gijtf40cbeffda", "89501t0cbeffda"],    //[16, 10],
          redirect: "ikutby0cbeffda"   //12
        },
        {
          // this is redirect on social story category
          deletedList: ["m83c310cbeffda", "9gvej70cbeffda", "c3ofjv0cbeffda"],   // [1, 2, 65]
          redirect: "go30gq0cbeffda"  //3
        },
        {
          // facebook ads will redirect on facebook post
          deletedList: ["2g3gml0cbeffda"],     //[55],
          redirect: "23bdun0cbeffda"     //13
        },
        {
          // instagram ads will redirect on instagram post
          deletedList: ["8lqvf00cbeffda"],   //[50],
          redirect: "mmdme10cbeffda"   //6
        },
        {
          // poster US is deleted category
          deletedList: ["len23q0cbeffda"],        //[35],
          redirect: "b0uthz0cbeffda"   //34
        },
        {
          // invitation is deleted category
          deletedList: ["4tqds70cbeffda"],        //[46],
          redirect: "f5ad320cbeffda"     //44
        }
      ],
      IMAGE_CATEGORY: [
        {
          header: 'Featured',
          subcat_list: [
            {
              "sub_category_name": "Flyers",
              "thumbnail_img": "./assets/cat-imgs/Flyer.png",
              "sub_category_id": "hl903t0cbeffda",   //37
              "height": "200px",
              "width": "163px",
              "background": "#700410",
              "original_width": "650",
              "original_height": "800",
              "cssSpriteClass": "css-sp-images-Flyer",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Brochures",
              "thumbnail_img": "./assets/cat-imgs/Trifold-Brochure.png",
              "sub_category_id": "xjzjjj0cbeffda",    //39,
              "height": "200px",
              "width": "163px",
              "background": "#517F6B",
              "original_width": "1056",
              "original_height": "816",
              "cssSpriteClass": "css-sp-images-Trifold-Brochure",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Business Cards",
              "thumbnail_img": "./assets/cat-imgs/Business-Card.png",
              "sub_category_id": "b8iatr0cbeffda",    //41,
              "height": "200px",
              "width": "163px",
              "background": "#EDAA02",
              "original_width": "1050",
              "original_height": "600",
              "cssSpriteClass": "css-sp-images-Business-Card",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Invitation",
              "thumbnail_img": "./assets/cat-imgs/Invitation-p.png",
              "sub_category_id": "f5ad320cbeffda",    //44,
              "height": "200px",
              "width": "163px",
              "background": "#F491BC",
              "original_width": "816",
              "original_height": "1200",
              "cssSpriteClass": "css-sp-images-Invitation-p",
              "sizeType": 'px',
              "content_type":4
            },
            /* {
                "sub_category_name": "Posters US",
                "thumbnail_img": "./assets/cat-imgs/Poster-us.png",
                "sub_category_id": 35,
                "height": "200px",
                "width": "163px",
                "background": "#000165",
                "original_width": "5400px",
                "original_height": "7200px",
                "cssSpriteClass": "css-sp-images-Poster-us"
            }, */
            {
              "sub_category_name": "Posters",
              "thumbnail_img": "./assets/cat-imgs/Poster.png",
              "sub_category_id": "b0uthz0cbeffda",    //34,
              "height": "200px",
              "width": "163px",
              "background": "#EE5D42",
              "original_width": "650",
              "original_height": "800",
              "cssSpriteClass": "css-sp-images-Poster",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Product Ads",
              "thumbnail_img": "./assets/cat-imgs/product_ad.jpg",
              "sub_category_id": "dzx3220cbeffda",        //64,
              "height": "74px",
              "width": "130px",
              "background": "#FFCD43",
              "original_width": "1050",
              "original_height": "600",
              "cssSpriteClass": "css-sp-images-product_ad",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Logo",
              "thumbnail_img": "./assets/cat-imgs/logo.png",
              "sub_category_id": "a2cid00cbeffda",         //38,
              "height": "200px",
              "width": "163px",
              "background": "#FF0172",
              "original_width": "512",
              "original_height": "512",
              "cssSpriteClass": "css-sp-images-logo",
              "sizeType": 'px',
              "content_type":4
            }
          ]
        },
        {
          header: 'Social Media',
          subcat_list: [
            {
              "sub_category_name": "Instagram Post",
              "thumbnail_img": "./assets/cat-imgs/inst-post.png",
              "sub_category_id": "mmdme10cbeffda",         //6,
              "height": "150px",
              "width": "263px",
              "background": "#37666B",
              "original_width": "1080",
              "original_height": "1080",
              "cssSpriteClass": "css-sp-images-inst-post",
              "sizeType": 'px',
              "content_type":4
            },
            {
              // "sub_category_name": "Instagram Story",
              "sub_category_name": "Instagram Story",
              "thumbnail_img": "./assets/cat-imgs/inst-story.png",
              "sub_category_id": "go30gq0cbeffda",         //3,
              "height": "200px",
              "width": "163px",
              "background": "#CDA998",
              "original_width": "1080",
              "original_height": "1920",
              "cssSpriteClass": "css-sp-images-inst-story",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Profile Pictures",
              "thumbnail_img": "./assets/cat-imgs/Fcbook-Avatar.png",
              "sub_category_id": "f1meej0cbeffda",         //7,
              "height": "204px",
              "width": "264px",
              "background": "#F6D302",
              "original_width": "800",
              "original_height": "800",
              "cssSpriteClass": "css-sp-images-Fcbook-Avatar",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Facebook Story",
              "thumbnail_img": "./assets/cat-imgs/fcbook-Canvas.png",
              "sub_category_id": "9gvej70cbeffda",         //2,
              //"sub_category_id": 3,   //merge into one categry
              "height": "200px",
              "width": "163px",
              "background": "#01D0F2",
              "original_width": "1080",
              "original_height": "1920",
              "cssSpriteClass": "css-sp-images-fcbook-Canvas",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Facebook Post",
              "thumbnail_img": "./assets/cat-imgs/fcbook-post.png",
              "sub_category_id": "23bdun0cbeffda",         //13,
              "height": "75px",
              "width": "200px",
              "background": "#C05E2C",
              "original_width": "1200",
              "original_height": "630",
              "cssSpriteClass": "css-sp-images-fcbook-post",
              "sizeType": 'px',
              "content_type":4
            },
            /* {
                "sub_category_name": "Facebook Mobile Cover",
                "thumbnail_img": "./assets/cat-imgs/Fcbook-Mobile-Cover.png",
                "sub_category_id": 10,
                "height": "140px",
                "width": "168px",
                "background": "#FCB50A",
                "original_width": "640",
                "original_height": "360",
                "cssSpriteClass": "css-sp-images-Fcbook-Mobile-Cover",
                "sizeType": 'px'
            }, */
            {
              // "sub_category_name": "Facebook Fanpage Cover",
              "sub_category_name": "Facebook Cover",
              "thumbnail_img": "./assets/cat-imgs/Fcbook-Fanpage-Cover.png",
              "sub_category_id": "ikutby0cbeffda",         //12,
              "height": "128px",
              "width": "255px",
              "background": "#FFD14A",
              "original_width": "820",
              "original_height": "312",
              "cssSpriteClass": "css-sp-images-Fcbook-Fanpage-Cover",
              "sizeType": 'px',
              "content_type":4
            },
            /* {
                "sub_category_name": "Facebook Event Cover",
                "thumbnail_img": "./assets/cat-imgs/Facebook-Event-Cover.png",
                "sub_category_id": 68,
                "height": "128px",
                "width": "255px",
                "background": "#FFD14A",
                "original_width": "1200",
                "original_height": "628",
                "cssSpriteClass": "css-sp-images-Fcbook-Fanpage-Cover",
                "sizeType": 'px'
            },
            {
                "sub_category_name": "Facebook Group Cover",
                "thumbnail_img": "./assets/cat-imgs/Facebook-Group-Cover.png",
                "sub_category_id": 69,
                "height": "128px",
                "width": "255px",
                "background": "#FFD14A",
                "original_width": "1640",
                "original_height": "856",
                "cssSpriteClass": "css-sp-images-Fcbook-Fanpage-Cover",
                "sizeType": 'px'
            }, */
            /* {
                "sub_category_name": "Facebook Desktop Cover",
                "thumbnail_img": "./assets/cat-imgs/Fcbook-Desktop-Cover.png",
                "sub_category_id": 16,
                "height": "150px",
                "width": "267px",
                "background": "#E14E2E",
                "original_width": "851",
                "original_height": "315",
                "cssSpriteClass": "css-sp-images-Fcbook-Desktop-Cover",
                "sizeType": 'px'
            }, */
            {
              "sub_category_name": "Twitter Post",
              "thumbnail_img": "./assets/cat-imgs/Twiter-Post.png",
              "sub_category_id": "jc49270cbeffda",          //15,
              "height": "150px",
              "width": "267px",
              "background": "#C34C0D",
              "original_width": "1024",
              "original_height": "512",
              "cssSpriteClass": "css-sp-images-Twiter-Post",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Twitter Header",
              "thumbnail_img": "./assets/cat-imgs/Twiter-Header.png",
              "sub_category_id": "okebyw0cbeffda",         //17,
              "height": "150px",
              "width": "267px",
              "background": "#E03237",
              "original_width": "1500",
              "original_height": "500",
              "cssSpriteClass": "css-sp-images-Twiter-Header",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "LinkedIn Post",
              "thumbnail_img": "./assets/cat-imgs/LnkedIn-Post-Header.png",
              "sub_category_id": "qq0hb90cbeffda",          //14,
              "height": "90px",
              "width": "160px",
              "background": "#E7E7E9",
              "original_width": "1200",
              "original_height": "628",
              "cssSpriteClass": "css-sp-images-LnkedIn-Post-Header",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Linkedin Cover",
              "thumbnail_img": "./assets/cat-imgs/LnkedIn-Banner.png",
              "sub_category_id": "1ac7mz0cbeffda",          //18,
              "height": "150px",
              "width": "267px",
              "background": "#FED530",
              // "original_width": "646px",
              // "original_height": "220px",
              "original_width": "1584",
              "original_height": "396",
              "cssSpriteClass": "css-sp-images-LnkedIn-Banner",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "YouTube Thumbnail",
              "thumbnail_img": "./assets/cat-imgs/YTube-Thumbnail.png",
              "sub_category_id": "u9nkab0cbeffda",         //11,
              "height": "180px",
              "width": "179px",
              "background": "#191E27",
              "original_width": "1280",
              "original_height": "720",
              "cssSpriteClass": "css-sp-images-YTube-Thumbnail",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "YouTube Channel Art",
              "thumbnail_img": "./assets/cat-imgs/YTube-Channel-Art.png",
              "sub_category_id": "4qi2c20cbeffda",          //19,
              "height": "150px",
              "width": "267px",
              "background": "#EEC368",
              "original_width": "2560",
              "original_height": "1440",
              "cssSpriteClass": "css-sp-images-YTube-Channel-Art",
              "sizeType": 'px',
              "content_type":4
            },
            /* {
                "sub_category_name": "Soundcloud Banners",
                "thumbnail_img": "./assets/cat-imgs/Soundcloud-Banner.png",
                "sub_category_id": "cvy93x0cbeffda",         //21,
                "height": "150px",
                "width": "267px",
                "background": "#FBCB8A",
                "original_width": "2480",
                "original_height": "520",
                "cssSpriteClass": "css-sp-images-Soundcloud-Banner",
                "sizeType": 'px'
            }, */
            {
              "sub_category_name": "Google My Business",
              "thumbnail_img": "./assets/cat-imgs/Google-My-Business.png",
              "sub_category_id": "ro0hc80cbeffda",          //9,
              "height": "238px",
              "width": "162px",
              "background": "#3D0914",
              "original_width": "720",
              "original_height": "540",
              "cssSpriteClass": "css-sp-images-Google-My-Business",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Etsy Cover Photo",
              "thumbnail_img": "./assets/cat-imgs/Etsy-Cover-Photo.png",
              "sub_category_id": "jthot90cbeffda",          //20,
              "height": "150px",
              "width": "267px",
              "background": "#0DACCF",
              "original_width": "1200",
              "original_height": "300",
              "cssSpriteClass": "css-sp-images-Etsy-Cover-Photo",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Etsy Shop Icon",
              "thumbnail_img": "./assets/cat-imgs/Etsy-shop-icon.png",
              "sub_category_id": "7cz4we0cbeffda",          //8,
              "height": "238px",
              "width": "162px",
              "background": "#FFFFFF",
              "original_width": "500",
              "original_height": "500",
              "cssSpriteClass": "css-sp-images-Etsy-shop-icon",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "WhatsApp Story",
              "thumbnail_img": "./assets/cat-imgs/Whatsapp-Story.jpg",
              "sub_category_id": "c3ofjv0cbeffda",          //65,
              //"sub_category_id": 3,  //merge into one categry
              "height": "238px",
              "width": "162px",
              "background": "#FFFFFF",
              "original_width": "1080",
              "original_height": "1920",
              "cssSpriteClass": "css-sp-images-Whatsapp-Story",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Pinterest Pins",
              "thumbnail_img": "./assets/cat-imgs/pint-pins.png",
              "sub_category_id": "ixsurw0cbeffda",          //4,
              "height": "203px",
              "width": "203px",
              "background": "#D2CDC6",
              "original_width": "600",
              "original_height": "900",
              "cssSpriteClass": "css-sp-images-pint-pins",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Tumblr Graphic",
              "thumbnail_img": "./assets/cat-imgs/Tumblr-Graphic.png",
              "sub_category_id": "8or8j60cbeffda",          //5,
              "height": "174px",
              "width": "174px",
              "background": "#FDE89D",
              "original_width": "540",
              "original_height": "810",
              "cssSpriteClass": "css-sp-images-Tumblr-Graphic",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Snapchat Geo Filter",
              "thumbnail_img": "./assets/cat-imgs/Snapchat-Geo-Filter.png",
              "sub_category_id": "m83c310cbeffda",      //1,
              //"sub_category_id": 3, //merge into one categry
              "height": "200px",
              "width": "163px",
              "background": "#F5CB12",
              "original_width": "1080",
              "original_height": "1920",
              "cssSpriteClass": "css-sp-images-Snapchat-Geo-Filter",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Comics",
              "thumbnail_img": "./assets/cat-imgs/Comics.jpg",
              "sub_category_id": "ka58lh0cbeffda",         //67,
              "height": "120px",
              "width": "150px",
              "background": "#F6D302",
              "original_width": "800",
              "original_height": "640",
              "cssSpriteClass": "css-sp-images-Comics",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Twitch Banner",
              "thumbnail_img": "./assets/cat-imgs/Twitch-Banner.jpg",
              "sub_category_id": "2u9evi0cbeffda",          //139,
              "height": "120px",
              "width": "150px",
              "background": "#F6D302",
              "original_width": "900",
              "original_height": "480",
              "cssSpriteClass": "css-sp-images-Twitch-Banner",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Highlight Cover",
              "thumbnail_img": "./assets/cat-imgs/Highlight-Cover.jpg",
              "sub_category_id": "kltvwr0cbeffda",        //70
              "height": "250px",
              "width": "141px",
              "background": "#d4d3cf",
              "original_width": "1080",
              "original_height": "1920",
              "cssSpriteClass": "css-sp-images-Highlight-Cover",
              "sizeType": "px",
              "content_type":4
            },
    
    
          ]
        },
        {
          header: 'Ads & commercials',
          subcat_list: [
            {
              "sub_category_name": "Roll Up Banners",
              "thumbnail_img": "./assets/cat-imgs/rollup-banner.png",
              "sub_category_id": "8db16b0cbeffda",          //47,
              "height": "200px",
              "width": "163px",
              "background": "#FFFEEC",
              "original_width": "350",
              "original_height": "670",
              "cssSpriteClass": "css-sp-images-rollup-banner",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Wide Skyscraper (IAB)",
              "thumbnail_img": "./assets/cat-imgs/wd-skyscraper.png",
              "sub_category_id": "rdc0ku0cbeffda",          //48,
              "height": "200px",
              "width": "163px",
              "background": "#EE5D42",
              "original_width": "160",
              "original_height": "600",
              "cssSpriteClass": "css-sp-images-wd-skyscraper",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Banners",
              "thumbnail_img": "./assets/cat-imgs/Banner.png",
              "sub_category_id": "3qqzf50cbeffda",      //49,
              "height": "200px",
              "width": "163px",
              "background": "#3C8EAE",
              "original_width": "250",
              "original_height": "250",
              "cssSpriteClass": "css-sp-images-Banner",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Instagram Ads",
              "thumbnail_img": "./assets/cat-imgs/inst-orng.png",
              "sub_category_id": "8lqvf00cbeffda",          //50,
              // "sub_category_id": 6,  // merge category into instagram post
              "height": "200px",
              "width": "163px",
              "background": "#E5695E",
              "original_width": "1080",
              "original_height": "1080",
              "cssSpriteClass": "css-sp-images-inst-orng",
              "sizeType": 'px',
              "content_type":4
            },
            /* {
                "sub_category_name": "Mobile Banner Square",
                "thumbnail_img": "./assets/cat-imgs/Mobile-Banner-Square.png",
                "sub_category_id": 51,
                "height": "200px",
                "width": "163px",
                "background": "#9F0616",
                "original_width": "336px",
                "original_height": "280px",
                "cssSpriteClass": "css-sp-images-Mobile-Banner-Square"
            }, */
            {
              "sub_category_name": "Large Rectangle (IAB)",
              "thumbnail_img": "./assets/cat-imgs/Large-Rectiab.png",
              "sub_category_id": "p56g6f0cbeffda",          //52,
              "height": "200px",
              "width": "163px",
              "background": "#131313",
              "original_width": "336",
              "original_height": "280",
              "cssSpriteClass": "css-sp-images-Large-Rectiab",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Medium Rectangle (IAB)",
              "thumbnail_img": "./assets/cat-imgs/medium-Rectiab.png",
              "sub_category_id": "ucg0bg0cbeffda",          //53,
              "height": "200px",
              "width": "163px",
              "background": "#626262",
              "original_width": "300",
              "original_height": "250",
              "cssSpriteClass": "css-sp-images-medium-Rectiab",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Youtube Banners",
              "thumbnail_img": "./assets/cat-imgs/yt-banner.png",
              "sub_category_id": "4aop3t0cbeffda",          //54,
              "height": "200px",
              "width": "163px",
              "background": "#0FC26E",
              "original_width": "2560",
              "original_height": "1440",
              "cssSpriteClass": "css-sp-images-yt-banner",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Facebook Ads",
              "thumbnail_img": "./assets/cat-imgs/Fcbook-Ad.png",
              "sub_category_id": "2g3gml0cbeffda",          //55,
              // "sub_category_id": 13,  // merge category into facebook post
              "height": "200px",
              "width": "163px",
              "background": "#674227",
              "original_width": "1200",
              "original_height": "628",
              "cssSpriteClass": "css-sp-images-Fcbook-Ad",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "FB Mobile Banners",
              "thumbnail_img": "./assets/cat-imgs/Fcb-mb-bnr.png",
              "sub_category_id": "zcf7vc0cbeffda",      //56,
              "height": "200px",
              "width": "163px",
              "background": "#5DB8D5",
              "original_width": "600",
              "original_height": "315",
              "cssSpriteClass": "css-sp-images-Fcb-mb-bnr",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "FB Web Banners",
              "thumbnail_img": "./assets/cat-imgs/Fcb-wb-bnr.png",
              "sub_category_id": "pdtpiu0cbeffda",          //57,
              "height": "200px",
              "width": "163px",
              "background": "#E13A30",
              "original_width": "851",
              "original_height": "315",
              "cssSpriteClass": "css-sp-images-Fcb-wb-bnr",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Mobile Banner Large",
              "thumbnail_img": "./assets/cat-imgs/mb-bnr-lg.png",
              "sub_category_id": "kvuw1z0cbeffda",      //58,
              "height": "200px",
              "width": "163px",
              "background": "#A2C4C6",
              "original_width": "320",
              "original_height": "100",
              "cssSpriteClass": "css-sp-images-mb-bnr-lg",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Leaderboard (Web)",
              "thumbnail_img": "./assets/cat-imgs/ldrbrd-web.png",
              "sub_category_id": "s9tbrb0cbeffda",      //59,
              "height": "200px",
              "width": "163px",
              "background": "#1D3147",
              "original_width": "970",
              "original_height": "250",
              "cssSpriteClass": "css-sp-images-ldrbrd-web",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Mobile Banner small",
              "thumbnail_img": "./assets/cat-imgs/mb-bnr-sm.png",
              "sub_category_id": "6phyog0cbeffda",          //60,
              "height": "200px",
              "width": "163px",
              "background": "#F68206",
              "original_width": "300",
              "original_height": "50",
              "cssSpriteClass": "css-sp-images-mb-bnr-sm",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Leaderboard (IAB)",
              "thumbnail_img": "./assets/cat-imgs/lb-iab.png",
              "sub_category_id": "kq1u680cbeffda",      //61,
              "height": "200px",
              "width": "163px",
              "background": "#D74845",
              "original_width": "728",
              "original_height": "90",
              "cssSpriteClass": "css-sp-images-lb-iab",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Product Ads",
              "thumbnail_img": "./assets/cat-imgs/product_ad.jpg",
              "sub_category_id": "dzx3220cbeffda",          //64,
              "height": "74px",
              "width": "130px",
              "background": "#FFCD43",
              "original_width": "1050",
              "original_height": "600",
              "cssSpriteClass": "css-sp-images-product_ad",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Soundcloud Banners",
              "thumbnail_img": "./assets/cat-imgs/Soundcloud-Banner.png",
              "sub_category_id": "cvy93x0cbeffda",          //21,
              "height": "150px",
              "width": "267px",
              "background": "#FBCB8A",
              "original_width": "2480",
              "original_height": "520",
              "cssSpriteClass": "css-sp-images-Soundcloud-Banner",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Billboard",
              "thumbnail_img": "./assets/cat-imgs/Billboard.jpg",
              "sub_category_id": "9uth460cbeffda",      //68,
              "height": "150px",
              "width": "267px",
              "background": "#FBCB8A",
              "original_width": "1920",
              "original_height": "819",
              "cssSpriteClass": "css-sp-images-billboard",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Tickets",
              "thumbnail_img": "./assets/cat-imgs/Tickets.png",
              "sub_category_id": "xnvvch0cbeffda",          //138,
              "height": "200px",
              "width": "163px",
              "background": "#FF0172",
              "original_width": "1650",
              "original_height": "600",
              "cssSpriteClass": "css-sp-images-Tickets",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Invoice",
              "thumbnail_img": "./assets/cat-imgs/Invoice.png",
              "sub_category_id": "wpkoeo0cbeffda",          //136,
              "height": "200px",
              "width": "163px",
              "background": "#FF0172",
              "original_width": "794",
              "original_height": "1123",
              "cssSpriteClass": "css-sp-images-Invoice",
              "sizeType": 'px',
              "content_type":4
            },
          ]
        },
        {
          header: 'Events & Invitation Cards',
          subcat_list: [
            {
              "sub_category_name": "Wedding Invitation",
              "thumbnail_img": "./assets/cat-imgs/Wedding-Invitation.png",
              "sub_category_id": "jhruak0cbeffda",          //43,
              "height": "200px",
              "width": "163px",
              "background": "#FBF3E9",
              "original_width": "816",
              "original_height": "1200",
              "cssSpriteClass": "css-sp-images-Wedding-Invitation",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Invitation",
              // "sub_category_name": "Invitation (portrait)",
              "thumbnail_img": "./assets/cat-imgs/Invitation-p.png",
              "sub_category_id": "f5ad320cbeffda",          //44,
              "height": "200px",
              "width": "163px",
              "background": "#F491BC",
              "original_width": "816",
              "original_height": "1200",
              "cssSpriteClass": "css-sp-images-Invitation-p",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Announcement",
              "thumbnail_img": "./assets/cat-imgs/announcement.png",
              "sub_category_id": "h94ali0cbeffda",          //45,
              "height": "200px",
              "width": "163px",
              "background": "#0D479B",
              "original_width": "816",
              "original_height": "1200",
              "cssSpriteClass": "css-sp-images-announcement",
              "sizeType": 'px',
              "content_type":4
            },
            /* {
                "sub_category_name": "Invitation",
                "thumbnail_img": "./assets/cat-imgs/Invitation.png",
                "sub_category_id": 46,
                "height": "200px",
                "width": "163px",
                "background": "#001344",
                "original_width": "1654",
                "original_height": "1654",
                "cssSpriteClass": "css-sp-images-Invitation",
                "sizeType": 'px'
            }, */
            {
              "sub_category_name": "Greetings",
              "thumbnail_img": "./assets/cat-imgs/greatings.jpg",
              "sub_category_id": "bhravn0cbeffda",          //62,
              "height": "174px",
              "width": "174px",
              "background": "#ff1760",
              "original_width": "1080",
              "original_height": "1080",
              "cssSpriteClass": "css-sp-images-greatings",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Postcard",
              "thumbnail_img": "./assets/cat-imgs/Postcard.png",
              "sub_category_id": "ktbl780cbeffda",      //133,
              "height": "200px",
              "width": "163px",
              "background": "#FF0172",
              "original_width": "1800",
              "original_height": "1200",
              "cssSpriteClass": "css-sp-images-Postcard",
              "sizeType": 'px',
              "content_type":4
            }
          ]
        },
        {
          header: 'Marketing Materials',
          subcat_list: [
            {
              "sub_category_name": "Posters",
              "thumbnail_img": "./assets/cat-imgs/Poster.png",
              "sub_category_id": "b0uthz0cbeffda",          //34,
              "height": "200px",
              "width": "163px",
              "background": "#EE5D42",
              "original_width": "650",
              "original_height": "800",
              "cssSpriteClass": "css-sp-images-Poster",
              "sizeType": 'px',
              "content_type":4
            },
            /* {
                "sub_category_name": "Posters (US)",
                "thumbnail_img": "./assets/cat-imgs/Poster-us.png",
                "sub_category_id": 35,
                "height": "200px",
                "width": "163px",
                "background": "#000165",
                "original_width": "5400",
                "original_height": "7200",
                "cssSpriteClass": "css-sp-images-Poster-us",
                "sizeType": 'px'
            }, */
            {
              "sub_category_name": "Food & Drink Menu",
              "thumbnail_img": "./assets/cat-imgs/food-drink-mnu.png",
              "sub_category_id": "1ymu2m0cbeffda",          //36,
              "height": "200px",
              "width": "163px",
              "background": "#6D1C2C",
              "original_width": "1080",
              "original_height": "1920",
              "cssSpriteClass": "css-sp-images-food-drink-mnu",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Flyers",
              "thumbnail_img": "./assets/cat-imgs/Flyer.png",
              "sub_category_id": "hl903t0cbeffda",          //37,
              "height": "200px",
              "width": "163px",
              "background": "#700410",
              "original_width": "650",
              "original_height": "800",
              "cssSpriteClass": "css-sp-images-Flyer",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Logo",
              "thumbnail_img": "./assets/cat-imgs/logo.png",
              "sub_category_id": "a2cid00cbeffda",          //38,
              "height": "200px",
              "width": "163px",
              "background": "#FF0172",
              "original_width": "512",
              "original_height": "512",
              "cssSpriteClass": "css-sp-images-logo",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Trifold Brochures",
              "thumbnail_img": "./assets/cat-imgs/Trifold-Brochure.png",
              "sub_category_id": "xjzjjj0cbeffda",          //39,
              "height": "200px",
              "width": "163px",
              "background": "#517F6B",
              "original_width": "1056",
              "original_height": "816",
              "cssSpriteClass": "css-sp-images-Trifold-Brochure",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Gift Certificate",
              "thumbnail_img": "./assets/cat-imgs/Gift-Certificate.png",
              "sub_category_id": "tkw6oi0cbeffda",          //40,
              "height": "200px",
              "width": "163px",
              "background": "#ED9C16",
              "original_width": "576",
              "original_height": "384",
              "cssSpriteClass": "css-sp-images-Gift-Certificate",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Business Cards",
              "thumbnail_img": "./assets/cat-imgs/Business-Card.png",
              "sub_category_id": "b8iatr0cbeffda",          //41,
              "height": "200px",
              "width": "163px",
              "background": "#EDAA02",
              "original_width": "1050",
              "original_height": "600",
              "cssSpriteClass": "css-sp-images-Business-Card",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Email Header",
              "thumbnail_img": "./assets/cat-imgs/Email-Header.png",
              "sub_category_id": "3fuy570cbeffda",          //42,
              "height": "200px",
              "width": "163px",
              "background": "#E0C0A2",
              "original_width": "600",
              "original_height": "200",
              "cssSpriteClass": "css-sp-images-Email-Header",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Branding Materials",
              "thumbnail_img": "./assets/cat-imgs/branding-material.png",
              "sub_category_id": "iimwn20cbeffda",          //66,
              "height": "200px",
              "width": "163px",
              "background": "#E6E5D3",
              "original_width": "512",
              "original_height": "512",
              "cssSpriteClass": "css-sp-images-branding-material",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Graph/Charts",
              "thumbnail_img": "./assets/cat-imgs/charts.png",
              "sub_category_id": "epnff468b6d6f1",          //145,
              "height": "200px",
              "width": "163px",
              "background": "#9EE0EF",
              "original_width": "1600",
              "original_height": "1200",
              "cssSpriteClass": "css-sp-images-graph",
              "sizeType": 'px',
              "content_type":4
            }
          ]
        },
        {
          header: 'Blogging & eBooks',
          subcat_list: [
            {
              "sub_category_name": "eBook",
              "thumbnail_img": "./assets/cat-imgs/eBook.png",
              "sub_category_id": "g0r9j10cbeffda",          //28,
              "height": "200px",
              "width": "163px",
              "background": "#904B23",
              "original_width": "1410",
              "original_height": "2250",
              "cssSpriteClass": "css-sp-images-eBook",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Blog Graphic",
              "thumbnail_img": "./assets/cat-imgs/Blog-graphics.png",
              "sub_category_id": "k99ga00cbeffda",          //29,
              "height": "200px",
              "width": "163px",
              "background": "#E15545",
              "original_width": "600",
              "original_height": "1200",
              "cssSpriteClass": "css-sp-images-Blog-graphics",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Infographic",
              "thumbnail_img": "./assets/cat-imgs/Infographic.png",
              "sub_category_id": "h81guu0cbeffda",      //30,
              "height": "200px",
              "width": "163px",
              "background": "#F603D6",
              "original_width": "800",
              "original_height": "2000",
              "cssSpriteClass": "css-sp-images-Infographic",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Album Cover",
              "thumbnail_img": "./assets/cat-imgs/album-cover.png",
              "sub_category_id": "pcezi10cbeffda",      //31,
              "height": "200px",
              "width": "163px",
              "background": "#FFAA6D",
              "original_width": "1400",
              "original_height": "1400",
              "cssSpriteClass": "css-sp-images-album-cover",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Blog Title",
              "thumbnail_img": "./assets/cat-imgs/Blog-Title.png",
              "sub_category_id": "31yizi0cbeffda",          //32,
              "height": "200px",
              "width": "163px",
              "background": "#D09FAB",
              "original_width": "560",
              "original_height": "315",
              "cssSpriteClass": "css-sp-images-Blog-Title",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Blog Image",
              "thumbnail_img": "./assets/cat-imgs/Blog-Image.png",
              "sub_category_id": "b8johc0cbeffda",          //33,
              "height": "200px",
              "width": "163px",
              "background": "#2B29C6",
              "original_width": "1200",
              "original_height": "600",
              "cssSpriteClass": "css-sp-images-Blog-Image",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Storyboards",
              "thumbnail_img": "./assets/cat-imgs/Storyboards.jpg",
              "sub_category_id": "ofnnua0cbeffda",      //69,
              "height": "200px",
              "width": "163px",
              "background": "#2B29C6",
              "original_width": "800",
              "original_height": "640",
              "cssSpriteClass": "css-sp-images-storyboard",
              "sizeType": 'px',
              "content_type":4
            }
          ]
        },
        {
          header: 'Documents & Letters',
          subcat_list: [
            {
              "sub_category_name": "A4",
              "thumbnail_img": "./assets/cat-imgs/a4.png",
              "sub_category_id": "4za75q0cbeffda",      //22,
              "height": "200px",
              "width": "163px",
              "background": "#D0130C",
              "original_width": "2480",
              "original_height": "3508",
              "cssSpriteClass": "css-sp-images-a4",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Letterhead(A4)",
              "thumbnail_img": "./assets/cat-imgs/Letterhead(A4).png",
              "sub_category_id": "m8k8ip0cbeffda",      //23,
              "height": "200px",
              "width": "163px",
              "background": "#FFA264",
              "original_width": "2480",
              "original_height": "3508",
              "cssSpriteClass": "css-sp-images-Letterhead-A4",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Resume",
              "thumbnail_img": "./assets/cat-imgs/resume.png",
              "sub_category_id": "o8yl660cbeffda",          //24,
              "height": "200px",
              "width": "163px",
              "background": "#39B2C3",
              "original_width": "816",
              "original_height": "1056",
              "cssSpriteClass": "css-sp-images-resume",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Bio Data",
              "thumbnail_img": "./assets/cat-imgs/bio-data.png",
              "sub_category_id": "vamzxf0cbeffda",      //63,
              "height": "160px",
              "width": "130px",
              "background": "#39B2C3",
              "original_width": "650",
              "original_height": "800",
              "cssSpriteClass": "css-sp-images-bio-data",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Certificate",
              "thumbnail_img": "./assets/cat-imgs/Certificate.png",
              "sub_category_id": "ij48cn0cbeffda",      //25,
              "height": "200px",
              "width": "163px",
              "background": "#D69612",
              "original_width": "1056",
              "original_height": "816",
              "cssSpriteClass": "css-sp-images-Certificate",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Presentation (16:9)",
              "thumbnail_img": "./assets/cat-imgs/Presentation.png",
              "sub_category_id": "jwpeam0cbeffda",      //26,
              "height": "200px",
              "width": "163px",
              "background": "#F6E9CC",
              "original_width": "1920",
              "original_height": "1080",
              "cssSpriteClass": "css-sp-images-Presentation-169",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Presentation (4:3)",
              "thumbnail_img": "./assets/cat-imgs/Presentation (169).png",
              "sub_category_id": "7y6ah00cbeffda",      //27,
              "height": "200px",
              "width": "163px",
              "background": "#1D65A2",
              "original_width": "1024",
              "original_height": "768",
              "cssSpriteClass": "css-sp-images-Presentation",
              "sizeType": 'px',
              "content_type":4
            }
          ]
        },
        {
          header: 'Personalization',
          subcat_list: [
            {
              "sub_category_name": "Calendar",
              "thumbnail_img": "./assets/cat-imgs/Calendar.png",
              "sub_category_id": "hbc43g0cbeffda",      //134,
              "height": "200px",
              "width": "163px",
              "background": "#FF0172",
              "original_width": "1280",
              "original_height": "1024",
              "cssSpriteClass": "css-sp-images-Calendar",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Planner",
              "thumbnail_img": "./assets/cat-imgs/Planner.png",
              "sub_category_id": "o4psxf0cbeffda",      //135,
              "height": "200px",
              "width": "163px",
              "background": "#FF0172",
              "original_width": "1748",
              "original_height": "2480",
              "cssSpriteClass": "css-sp-images-Planner",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Flowchart",
              "thumbnail_img": "./assets/cat-imgs/Flowchart.png",
              "sub_category_id": "j5pzax0cbeffda",      //137,
              "height": "200px",
              "width": "163px",
              "background": "#FF0172",
              "original_width": "1600",
              "original_height": "1200",
              "cssSpriteClass": "css-sp-images-Flowchart",
              "sizeType": 'px',
              "content_type":4
            },
            {
              "sub_category_name": "Desktop Wallpaper",
              "thumbnail_img": "./assets/cat-imgs/Desktop-Wallpaper.png",
              "sub_category_id": "1ozr060cbeffda",          //108,
              "height": "200px",
              "width": "163px",
              "background": "#FF0172",
              "original_width": "1920",
              "original_height": "1080",
              "cssSpriteClass": "css-sp-images-Desktop-Wallpaper",
              "sizeType": 'px',
              "content_type":4
            }
          ]
        }
      ],
      VIDEO_CATEGORY: [
        {
          "header": "Featured",
          "subcat_list": [{
            "sub_category_name": "Instagram Post",
            "thumbnail_img": "./assets/cat-imgs/Flyer.png",
            // "video_src": "./assets/vid-cat-imgs/featured_inst_pst_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/6196025fd7038_preview_video_1637220959.mp4",
            "sub_category_id": "ajfvyv0cbeffda",      //109,
            "height": "200px",
            "width": "163px",
            "background": "#700410",
            "original_width": "1080",
            "original_height": "1080",
            "cssSpriteClass": "css-sp-vids-featured_inst_pst",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Social Story",
            "thumbnail_img": "./assets/cat-imgs/Trifold-Brochure.png",
            // "video_src": "./assets/vid-cat-imgs/featured_scl_stry_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/61961730cce2c_preview_video_1637226288.mp4",
            "sub_category_id": "bm86vn0cbeffda",      //110,
            "height": "200px",
            "width": "163px",
            "background": "#517F6B",
            "original_width": "1080",
            "original_height": "1920",
            "cssSpriteClass": "css-sp-vids-featured_scl_stry_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Facebook Post",
            "thumbnail_img": "./assets/cat-imgs/Business-Card.png",
            // "video_src": "./assets/vid-cat-imgs/featured_fb_pst_vd.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/619616abc3e4a_preview_video_1637226155.mp4",
            "sub_category_id": "qgtaji0cbeffda",      //111,
            "height": "200px",
            "width": "163px",
            "background": "#EDAA02",
            "original_width": "1200",
            "original_height": "630",
            "cssSpriteClass": "css-sp-vids-featured_fb_pst",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Flyers",
            "thumbnail_img": "./assets/cat-imgs/Invitation-p.png",
            // "video_src": "./assets/vid-cat-imgs/featured_poster_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e4fcaa22e9d1_preview_video_1582287522.mp4",
            "sub_category_id": "q83hx90cbeffda",      //127,
            "height": "200px",
            "width": "163px",
            "background": "#F491BC",
            "original_width": "650",
            "original_height": "800",
            "cssSpriteClass": "css-sp-vids-featured_poster_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Brochures",
            "thumbnail_img": "./assets/cat-imgs/Poster.png",
            // "video_src": "./assets/vid-cat-imgs/featured_broucher_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e75c3710659c_preview_video_1584776049.mp4",
            "sub_category_id": "zjd6ln0cbeffda",          //128,
            "height": "200px",
            "width": "163px",
            "background": "#EE5D42",
            "original_width": "1056",
            "original_height": "816",
            "cssSpriteClass": "css-sp-vids-featured_broucher_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Branding",
            "thumbnail_img": "./assets/cat-imgs/product_ad.jpg",
            // "video_src": "./assets/vid-cat-imgs/ads_branding_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f40a8db45922_preview_video_1598073051.mp4",
            "sub_category_id": "r0jfab0cbeffda",          //129,
            "height": "74px",
            "width": "130px",
            "background": "#FFCD43",
            "original_width": "1050",
            "original_height": "600",
            "cssSpriteClass": "css-sp-vids-ads_branding_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Invitation",
            "thumbnail_img": "./assets/cat-imgs/logo.png",
            // "video_src": "./assets/vid-cat-imgs/featured_invitation_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e4f76853d015_preview_video_1582265989.mp4",
            "sub_category_id": "kd186y0cbeffda",          //125,
            "height": "200px",
            "width": "163px",
            "background": "#FF0172",
            "original_width": "650",
            "original_height": "800",
            "cssSpriteClass": "css-sp-vids-featured_invitation_img",
            "sizeType": "px",
              "content_type":9
          }]
        }, {
          "header": "Social Media",
          "subcat_list": [{
            "sub_category_name": "Instagram Post",
            "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
            // "video_src": "./assets/vid-cat-imgs/featured_inst_pst_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/6196025fd7038_preview_video_1637220959.mp4",
            "sub_category_id": "ajfvyv0cbeffda",          //109,
            "height": "150px",
            "width": "150px",
            "background": "#42add7",
            "original_width": "1080",
            "original_height": "1080",
            "cssSpriteClass": "css-sp-vids-featured_inst_pst",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Social Story",
            "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-story.jpg",
            // "video_src": "./assets/vid-cat-imgs/featured_scl_stry_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/61961730cce2c_preview_video_1637226288.mp4",
            "sub_category_id": "bm86vn0cbeffda",      //110,
            "height": "250px",
            "width": "141px",
            "background": "#dacd99",
            "original_width": "1080",
            "original_height": "1920",
            "cssSpriteClass": "css-sp-vids-featured_scl_stry_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Facebook Post",
            "thumbnail_img": "./assets/cat-imgs/video-cats/facebook-post.jpg",
            // "video_src": "./assets/vid-cat-imgs/featured_fb_pst_vd.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/619616abc3e4a_preview_video_1637226155.mp4",
            "sub_category_id": "qgtaji0cbeffda",      //111,
            "height": "79px",
            "width": "151px",
            "background": "#ebe2db",
            "original_width": "1200",
            "original_height": "630",
            "cssSpriteClass": "css-sp-vids-featured_fb_pst",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Pinterest Pins",
            "thumbnail_img": "./assets/cat-imgs/video-cats/fcbook-Canvas.png",
            // "video_src": "./assets/vid-cat-imgs/scl_mid_pintrst_pin_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/61961c4e0da36_preview_video_1637227598.mp4",
            "sub_category_id": "sb7md90cbeffda",      //118,
            "height": "250px",
            "width": "141px",
            "background": "#dcd9d4",
            "original_width": "735",
            "original_height": "1102",
            "cssSpriteClass": "css-sp-vids-scl_mid_pintrst_pin_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Facebook Page Cover",
            "thumbnail_img": "./assets/cat-imgs/video-cats/facebook-page-video-cover.jpg",
            // "video_src": "./assets/vid-cat-imgs/scl_mid_fb_pg_cvr_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e32cc9cb4316_preview_video_1580387484.mp4",
            "sub_category_id": "phdw4f0cbeffda",          //112,
            "height": "85px",
            "width": "150px",
            "background": "#325978",
            "original_width": "820",
            "original_height": "312",
            "cssSpriteClass": "css-sp-vids-scl_mid_fb_pg_cvr_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Blog Videos",
            "thumbnail_img": "./assets/cat-imgs/video-cats/twitter-post.jpg",
            // "video_src": "./assets/vid-cat-imgs/scl_mid_blg_vid_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e32ccd7d3d95_preview_video_1580387543.mp4",
            "sub_category_id": "zexob80cbeffda",      //116,
            "height": "76px",
            "width": "151px",
            "background": "#19a8e4",
            "original_width": "1200",
            "original_height": "600",
            "cssSpriteClass": "css-sp-vids-scl_mid_blg_vid",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Twitter Post",
            "thumbnail_img": "./assets/cat-imgs/video-cats/twitter-header.jpg",
            // "video_src": "./assets/vid-cat-imgs/scl_mid_twiter_pst_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e968cd1855a0_preview_video_1586924753.mp4",
            "sub_category_id": "c0hl1i0cbeffda",      //113,
            "height": "50px",
            "width": "150px",
            "background": "#c9d8dd",
            "original_width": "900",
            "original_height": "450",
            "cssSpriteClass": "css-sp-vids-scl_mid_twiter_pst_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Linkedin Post",
            "thumbnail_img": "./assets/cat-imgs/video-cats/linkedin-post.jpg",
            // "video_src": "./assets/vid-cat-imgs/scl_mid_linkd_in_pst_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e32c2ced5560_preview_video_1580384974.mp4",
            "sub_category_id": "q1yhdy0cbeffda",      //115,
            "height": "78px",
            "width": "150px",
            "background": "#fdfdff",
            "original_width": "1200",
            "original_height": "628",
            "cssSpriteClass": "css-sp-vids-scl_mid_linkd_in_pst_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Tumblr Videos",
            "thumbnail_img": "./assets/cat-imgs/video-cats/youtube-channel-art.jpg",
            // "video_src": "./assets/vid-cat-imgs/scl_mid_tumblr_vid_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e4faaa42db12_preview_video_1582279332.mp4",
            "sub_category_id": "qwsxg80cbeffda",      //117,
            "height": "41px",
            "width": "150px",
            "background": "#fbd7b3",
            "original_width": "540",
            "original_height": "810",
            "cssSpriteClass": "css-sp-vids-scl_mid_tumblr_vid_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Snapchat Geo Filter",
            "thumbnail_img": "./assets/cat-imgs/video-cats/google-my-business-post.jpg",
            // "video_src": "./assets/vid-cat-imgs/scl_mid_snap_chat_geo_flter_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/619621bb76484_preview_video_1637228987.mp4",
            "sub_category_id": "otnbjg0cbeffda",      //119,
            "height": "112px",
            "width": "150px",
            "background": "#ee4e36",
            "original_width": "1080",
            "original_height": "1920",
            "cssSpriteClass": "css-sp-vids-scl_mid_snap_chat_geo_flter_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Twitter Header (supports GIF)",
            "thumbnail_img": "./assets/cat-imgs/video-cats/blog-videos.jpg",
            // "video_src": "./assets/vid-cat-imgs/scl_mid_twiter_hdr_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e43e043b4c50_preview_video_1581506627.mp4",
            "sub_category_id": "jma8w40cbeffda",      //114,
            "height": "76px",
            "width": "150px",
            "background": "#f3da1b",
            "original_width": "1500",
            "original_height": "500",
            "cssSpriteClass": "css-sp-vids-scl_mid_twiter_hdr_img",
            "sizeType": "px",
              "content_type":9
          }]
        }, {
          "header": "Ads & commercials",
          "subcat_list": [{
            "sub_category_name": "Square (1:1)",
            "thumbnail_img": "./assets/cat-imgs/video-cats/wide-skyscraper.jpg",
            // "video_src": "./assets/vid-cat-imgs/ads_square_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e2be52e11075_preview_video_1579935022.mp4",
            "sub_category_id": "dg2qo50cbeffda",      //121,
            "height": "250px",
            "width": "67px",
            "background": "#c43c2e",
            "original_width": "1080",
            "original_height": "1080",
            "cssSpriteClass": "css-sp-vids-ads_square_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Digital Display (16:9)",
            "thumbnail_img": "./assets/cat-imgs/video-cats/skyscraper.jpg",
            // "video_src": "./assets/vid-cat-imgs/ads_16-9_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f3d075e59774_preview_video_1597835102.mp4",
            "sub_category_id": "36lqnb0cbeffda",      //120,
            "height": "250px",
            "width": "50px",
            "background": "#f41158",
            "original_width": "1920",
            "original_height": "1080",
            "cssSpriteClass": "css-sp-vids-ads_16-9_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Digital Display (9:16)",
            "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-ads.jpg",
            // "video_src": "./assets/vid-cat-imgs/ads_9-16_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e2c0827226d7_preview_video_1579943975.mp4",
            "sub_category_id": "w2m7ct0cbeffda",      //123,
            "height": "150px",
            "width": "150px",
            "background": "#f6d0e9",
            "original_width": "1080",
            "original_height": "1920",
            "cssSpriteClass": "css-sp-vids-ads_9-16_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Google Ads",
            "thumbnail_img": "./assets/cat-imgs/video-cats/square.jpg",
            // "video_src": "./assets/vid-cat-imgs/ads_gogl_ads_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e2ed7cc781a3_preview_video_1580128204.mp4",
            "sub_category_id": "lokhgo0cbeffda",      //122,
            "height": "150px",
            "width": "150px",
            "background": "#9b6156",
            "original_width": "300",
            "original_height": "250",
            "cssSpriteClass": "css-sp-vids-ads_gogl_ads_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Flyers",
            "thumbnail_img": "./assets/cat-imgs/video-cats/large-rectangle.jpg",
            // "video_src": "./assets/vid-cat-imgs/featured_poster_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e4fcaa22e9d1_preview_video_1582287522.mp4",
            "sub_category_id": "q83hx90cbeffda",      //127,
            "height": "126px",
            "width": "151px",
            "background": "#f94842",
            "original_width": "650",
            "original_height": "800",
            "cssSpriteClass": "css-sp-vids-featured_poster_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Brochures",
            "thumbnail_img": "./assets/cat-imgs/video-cats/inline-rectangle.jpg",
            // "video_src": "./assets/vid-cat-imgs/featured_broucher_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e75c3710659c_preview_video_1584776049.mp4",
            "sub_category_id": "zjd6ln0cbeffda",      //128,
            "height": "124px",
            "width": "150px",
            "background": "#e9e838",
            "original_width": "1056",
            "original_height": "816",
            "cssSpriteClass": "css-sp-vids-featured_broucher_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Branding",
            "thumbnail_img": "./assets/cat-imgs/video-cats/facebook-ads.jpg",
            // "video_src": "./assets/vid-cat-imgs/ads_branding_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f40a8db45922_preview_video_1598073051.mp4",
            "sub_category_id": "r0jfab0cbeffda",      //129,
            "height": "79px",
            "width": "151px",
            "background": "#ff3821",
            "original_width": "1050",
            "original_height": "600",
            "cssSpriteClass": "css-sp-vids-ads_branding_img",
            "sizeType": "px",
              "content_type":9
          }]
        }, {
          "header": "Invitation, Greetings & Quotes",
          "subcat_list": [{
            "sub_category_name": "Invitation",
            "thumbnail_img": "./assets/cat-imgs/video-cats/invitation.jpg",
            // "video_src": "./assets/vid-cat-imgs/featured_invitation_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e4f76853d015_preview_video_1582265989.mp4",
            "sub_category_id": "kd186y0cbeffda",      //125,
            "height": "184px",
            "width": "150px",
            "background": "#1a025a",
            "original_width": "650",
            "original_height": "800",
            "cssSpriteClass": "css-sp-vids-featured_invitation_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Greetings",
            "thumbnail_img": "./assets/cat-imgs/video-cats/greetings.jpg",
            // "video_src": "./assets/vid-cat-imgs/invitation_greting_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e2ed6807a627_preview_video_1580127872.mp4",
            "sub_category_id": "vv1fou0cbeffda",       //126,
            "height": "150px",
            "width": "150px",
            "background": "#ef89a1",
            "original_width": "800",
            "original_height": "800",
            "cssSpriteClass": "css-sp-vids-invitation_greting_img",
            "sizeType": "px",
              "content_type":9
          }, {
            "sub_category_name": "Quotes",
            "thumbnail_img": "./assets/cat-imgs/video-cats/greetings.jpg",
            // "video_src": "./assets/vid-cat-imgs/quotes_quotes_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e2fd56b6d8f1_preview_video_1580193131.mp4",
            "sub_category_id": "nbdkfw0cbeffda",      //124,
            "height": "150px",
            "width": "150px",
            "background": "#ef89a1",
            "original_width": "1080",
            "original_height": "1080",
            "cssSpriteClass": "css-sp-vids-quotes_quotes_img",
            "sizeType": "px",
              "content_type":9
          }]
        }, {
          "header": "Miscellaneous",
          "subcat_list": [{
            "sub_category_name": "Resume/Biodata",
            "thumbnail_img": "./assets/cat-imgs/video-cats/flyers.jpg",
            // "video_src": "./assets/vid-cat-imgs/resume_vid.mp4",
            "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5e75db911e6a3_preview_video_1584782225.mp4",
            "sub_category_id": "sglkoi0cbeffda",      //130,
            "height": "184px",
            "width": "151px",
            "background": "#700410",
            "original_width": "650",
            "original_height": "800",
            "cssSpriteClass": "css-sp-vids-resume_img",
            "sizeType": "px",
              "content_type":9
          }]
        }],
      INTRO_CATEGORY: [
        {
          "subcat_list": [
            {
              "sub_category_name": "Intro",
              "sub_category_id": 'fimjpk4c93be91',   //141
              "template_list": [
                {
                  "content_id": "a6ba2o391b566b",   //45751,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2bf67ebbf90_preview_video_1596716670.mp4",
                  "cssSpriteClass": "css-sp-io-intro1",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'fimjpk4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Colorful Motion Intro"
                },
                {
                  "content_id": "162qir391b566b",   //45750,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2bf6010b4a2_preview_video_1596716545.mp4",
                  "cssSpriteClass": "css-sp-io-intro2",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'fimjpk4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Neon Light Intro"
                },
                {
                  "content_id": "j6jtml391b566b",   //45752,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2bf90421f10_preview_video_1596717316.mp4",
                  "cssSpriteClass": "css-sp-io-intro3",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'fimjpk4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Shapes Abstraction Intro"
                },
                {
                  "content_id": "j5lnew391b566b",      //45748,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2bf50a5d8da_preview_video_1596716298.mp4",
                  "cssSpriteClass": "css-sp-io-intro4",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'fimjpk4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Classic Service Intro"
                },
                {
                  "content_id": "s5u6yt391b566b",   //45749,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2bf55a41f83_preview_video_1596716378.mp4",
                  "cssSpriteClass": "css-sp-io-intro5",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'fimjpk4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Brush Art Intro"
                }
              ]
            },
            {
              "sub_category_name": "Logo Reveal",
              "sub_category_id": 'oiv39i4c93be91',    //142
              "template_list": [
                {
                  "content_id": "qudkcd391b566b",   //45549,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2a7f61d6d94_preview_video_1596620641.mp4",
                  "cssSpriteClass": "css-sp-io-lr1",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'oiv39i4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Watercolor Logo Reveal"
                },
                {
                  "content_id": "90joq1391b566b",   //45575,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2a8c53e6ba0_preview_video_1596623955.mp4",
                  "cssSpriteClass": "css-sp-io-lr2",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'oiv39i4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Chalk Logo Reveal"
                },
                {
                  "content_id": "i2okp5391b566b",   //45584,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2a903680706_preview_video_1596624950.mp4",
                  "cssSpriteClass": "css-sp-io-lr3",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'oiv39i4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Abstract Logo Animation"
                },
                {
                  "content_id": "8uung8391b566b",   //45551,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2a80bb586d8_preview_video_1596620987.mp4",
                  "cssSpriteClass": "css-sp-io-lr4",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'oiv39i4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "High Tech Logo Intro"
                },
                {
                  "content_id": "00b563391b566b",   //45574,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2a8be6bda42_preview_video_1596623846.mp4",
                  "cssSpriteClass": "css-sp-io-lr5",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'oiv39i4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Particle Fusion Logo"
                }
              ]
            },
            {
              "sub_category_name": "Outro",
              "sub_category_id": 'xj3mtf4c93be91',   //143
              "template_list": [
                {
                  "content_id": "ri3vnh391b566b",   //45649,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2b94c64d7bd_preview_video_1596691654.mp4",
                  "cssSpriteClass": "css-sp-io-outro1",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'xj3mtf4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Thanks For Watching"
                },
                {
                  "content_id": "ihvc3k391b566b",   //45648,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2b944fa3157_preview_video_1596691535.mp4",
                  "cssSpriteClass": "css-sp-io-outro2",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'xj3mtf4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Subscribe My Channel"
                },
                {
                  "content_id": "9jj4z2391b566b",   //45655,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2b997dc4d5c_preview_video_1596692861.mp4",
                  "cssSpriteClass": "css-sp-io-outro3",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'xj3mtf4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Like The Video, Get Notified"
                },
                {
                  "content_id": "0cndxm391b566b",    //45626,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2aa509dc070_preview_video_1596630281.mp4",
                  "cssSpriteClass": "css-sp-io-outro4",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'xj3mtf4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Turn On Notification"
                },
                {
                  "content_id": "9ikyrc391b566b",  //45651,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2b96f0079d6_preview_video_1596692208.mp4",
                  "cssSpriteClass": "css-sp-io-outro5",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": 'xj3mtf4c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Hit The Bell Icon"
                }
              ]
            },
            {
              "sub_category_name": "Marketing",
              "sub_category_id": '6jc6d44c93be91',   //144
              "template_list": [
                {
                  "content_id": "0xj6lu391b566b",   //45714,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2bce0d10e21_preview_video_1596706317.mp4",
                  "cssSpriteClass": "css-sp-io-mk1",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": '6jc6d44c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Big Deals"
                },
                {
                  "content_id": "146e3k391b566b",   //45742,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2bec80a2b86_preview_video_1596714112.mp4",
                  "cssSpriteClass": "css-sp-io-mk2",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": '6jc6d44c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Appointment For Spa"
                },
                {
                  "content_id": "j2r4s0391b566b",   //45736,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2be0f3c9073_preview_video_1596711155.mp4",
                  "cssSpriteClass": "css-sp-io-mk3",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": '6jc6d44c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "We Care To Fix It"
                },
                {
                  "content_id": "a2il82391b566b",   //45735,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2be04b0b38a_preview_video_1596710987.mp4",
                  "cssSpriteClass": "css-sp-io-mk4",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": '6jc6d44c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Be Beautiful!"
                },
                {
                  "content_id": "a5d3uz391b566b",   //45747,
                  "thumbnail_img": "./assets/cat-imgs/video-cats/instagram-post.jpg",
                  "video_src": "https://d3jmn01ri1fzgl.cloudfront.net/photoadking/video/5f2bf35e5d0d5_preview_video_1596715870.mp4",
                  "cssSpriteClass": "css-sp-io-mk5",
                  "height": "150px",
                  "width": "150px",
                  "sub_category_id": '6jc6d44c93be91',
                  "content_type": 10,
                  "background": "#42add7",
                  "original_width": "1920",
                  "original_height": "1080",
                  "sizeType": "px",
                  "name": "Unboxing"
                }
              ]
            }
          ]
        }],
      host: {
        API_URL: 'https://test.photoadking.com/api/public/api/',
        ASSETS_URL: RESOURCE_BASE + 'resource/',
        STOCK_URL: STAGE_RESOURCE_BASE + 'stock_photos/',
        SERVER_URL: RESOURCE_BASE + 'original/',
        BUCKET_URL: RESOURCE_BASE,
        BUCKET_COMPRESSED_URL: RESOURCE_BASE + 'compressed/',
        // USER_UPLOAD_URL: RESOURCE_BASE + 'user_upload/',
        USER_UPLOAD_URL: STAGE_RESOURCE_BASE + 'user_uploaded_original/',
        USER_UPLOADED_FONT: STAGE_RESOURCE_BASE + 'user_uploaded_fonts/',
        TRANSPARENT_URL: STAGE_RESOURCE_BASE + 'my_design/',
        THREED_OBJ_URL: STAGE_RESOURCE_BASE + 'object_images/',
        THREED_STL_PATH: RESOURCE_BASE + '3d_object/',
        FONTS_PATH: RESOURCE_BASE,
        INTRO_VIDEO_URL: RESOURCE_BASE + 'thumbnail_video/',
        SVG_PATH: RESOURCE_BASE + 'svg/',
        VIDEO_URL: RESOURCE_BASE + 'video/',
        AUDIO_URL: RESOURCE_BASE + 'audio/',
        USER_VIDEO_URL: STAGE_RESOURCE_BASE + 'user_uploaded_video/',
        USER_AUDIO_URL: STAGE_RESOURCE_BASE + 'user_uploaded_audio/',
        WATERMARK_URL: './assets/images/king_watermark.png?v2',
        FONT_JSON_PATH: RESOURCE_BASE + 'font_json/',
        ADVERTISEMENTS_URL: '../api/public/api/',
        FLYER_SUB_CAT_ID: "hl903t0cbeffda",  //37
        INSTA_POST_SUB_CAT_ID: 'ajfvyv0cbeffda',  // 109
        INTRO_SUB_CAT_ID: 'fimjpk4c93be91',  // 141
        SUBCATEGORY_ID: "iimwn20cbeffda",  // 66
        TEXTURE_SB_CAT_ID: "xjbaxc0cbeffda",      //102,
        VIDEOS_SB_CAT_ID: "4x39zj0cbeffda",   //132
        AUDIOS_SB_CAT_ID: "p9dllf0cbeffda",  //131
        TEXTURE_CATALOG_ID: "djv3qi55a26661",     //27,
        STKR_SUB_CAT_ID: "ovlhng0cbeffda",        //101,
        FONT_SUB_CAT_ID: "w1fie30cbeffda",        //105,
        STKR_SHAPE_SUB_CAT_ID: "2aakaq0cbeffda",      //106,
        STKR_BUTTON_SUB_CAT_ID: "nb6adb0cbeffda",     //107,
        TXT_SUB_CAT_ID: "l1s1q40cbeffda",         //103,
        TXT_ART_SUB_CAT_ID: "fvedim29c1b782",         //146,
        TXT_THM_SUB_CAT_ID: "hk714g72f085a0",     // 147
        MISCELLANEOUS_CATEGORY: ["dzx3220cbeffda"],   //64
        TWO_COLUMN_CATEGORY: "rdc0ku0cbeffda",  // 48
        THREEDCATEGORY: [
          {
            "sub_category_name": "3d Object",
            "thumbnail_img": "./assets/cat-imgs/tmblr.jpg",
            "sub_category_id": "4mybwj0cbeffda",      //104
          }
        ],
        PNGCONTENT: 1,
        SVGCONTENT: 8,
        FB_SHARING_ID: '478077186012266',
        REVEN_DSN: "https://becfd382aa4447aaadcf97ac18188cd6@sentry.io/1334404",
        /* paypal_plans: {
          monthly_starter: 'JZA3ARUDWXA86',
          monthly_pro: '7ZXSYZZBUZCUU',
          yearly_starter: 'NE65XNSSUQB72',
          yearly_pro: 'CA5FEXUY244T6',
        }, */
        paypal_plans: {
          monthly_starter: 'monthly-starter',
          monthly_pro: 'monthly-pro',
          yearly_starter: 'yearly-starter',
          yearly_pro: 'yearly-pro'
        },
        REVEN_OPTIONS: {
          release: '0e4fdef81448dcfa0e16ecc4433ff3997aa53572'
        },
        siteKeyCaptcha: "6LcX0sYUAAAAAGWPCllPgj9TLsIq6pd2U84-w5-y",
        Client_id :"23225721969-tm0mmf9pq3cmdo71qj2omkd2i06g0re8.apps.googleusercontent.com"
      },
      tools: {
        "qrcode": {
          "path": "/editor/hl903t0cbeffda/sbxndme8cd0b77"
        },
        "barcode": {
          "path": "/editor/wpkoeo0cbeffda/s0677l55a26661"
        },
        "charts": {
          "path": "/editor/epnff468b6d6f1"
        }
      }
};