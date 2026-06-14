import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    isOfferPopupEnabled: {
      type: Boolean,
      default: true,
    },
    offerPopupTitle: {
      type: String,
      default: 'Royal Bridal Season Exclusive',
    },
    offerPopupText: {
      type: String,
      default: 'Unlock up to 25% off bespoke orders this month. Use code BRIDE25 at checkout.',
    },
    offerPopupDiscountCode: {
      type: String,
      default: 'BRIDE25',
    },
    offerPopupBgColor: {
      type: String,
      default: '#7A0C2E', // Classic primary crimson color
    },
    isNewArrivalsEnabled: {
      type: Boolean,
      default: true,
    },
    newArrivalsTitle: {
      type: String,
      default: "What's New",
    },
    newArrivalsSubtitle: {
      type: String,
      default: "JUST ARRIVED",
    },
    isCelebrityChoiceEnabled: {
      type: Boolean,
      default: true,
    },
    celebrityChoiceTitle: {
      type: String,
      default: "Celebrity Closet",
    },
    celebrityChoiceSubtitle: {
      type: String,
      default: "AS SEEN ON CELEBRITIES",
    },
    heroSlides: {
      type: [
        {
          image: { type: String, required: true },
          title: { type: String, required: true }
        }
      ],
      default: [
        {
          image: '/images/hero/home.webp',
          title: 'Regal Couture'
        },
        {
          image: '/images/hero/1774874343974the-wedding.jpg',
          title: 'Ancestral Weaving'
        },
        {
          image: '/images/hero/1774946941021the-wedding.avif',
          title: 'Bespoke Collections'
        }
      ]
    },
    occasionsList: {
      type: [
        {
          name: { type: String, required: true },
          label: { type: String, required: true },
          img: { type: String, required: true },
          gridClass: { type: String, required: true }
        }
      ],
      default: [
        { 
          name: 'The Wedding', 
          label: 'The Wedding', 
          img: '/images/hero/1774946941021the-wedding.avif', 
          gridClass: 'md:row-span-2 md:col-span-1 h-full min-h-[300px]' 
        },
        { 
          name: 'Sangeet', 
          label: 'Sangeet Soirée', 
          img: '/images/occasions/1774947292365mehandi.avif', 
          gridClass: 'md:col-span-1 md:row-span-1 h-full' 
        },
        { 
          name: 'Haldi Rasam', 
          label: 'Haldi Rasam', 
          img: '/images/products/1774861981073groom-essentials.webp', 
          gridClass: 'md:col-span-1 md:row-span-1 h-full' 
        },
        { 
          name: 'Mehendi Moments', 
          label: 'Mehendi Moments', 
          img: '/images/occasions/1774947292365mehandi.avif', 
          gridClass: 'md:col-span-1 md:row-span-1 h-full' 
        },
        { 
          name: 'Reception', 
          label: 'Reception & Roka Ceremony', 
          img: '/images/occasions/1774948127503reception.avif', 
          gridClass: 'md:col-span-1 md:row-span-1 h-full' 
        }
      ]
    }
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
