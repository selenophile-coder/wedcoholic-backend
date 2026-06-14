import Settings from '../models/Settings.js';

// Seed starting site settings if none exist
export const seedInitialSettings = async () => {
  try {
    const count = await Settings.countDocuments();
    if (count === 0) {
      await Settings.create({
        isOfferPopupEnabled: true,
        offerPopupTitle: 'Royal Bridal Season Exclusive',
        offerPopupText: 'Unlock up to 25% off bespoke orders this month. Use code BRIDE25 at checkout.',
        offerPopupDiscountCode: 'BRIDE25',
        offerPopupBgColor: '#7A0C2E',
        isNewArrivalsEnabled: true,
        newArrivalsTitle: "What's New",
        newArrivalsSubtitle: 'JUST ARRIVED',
        isCelebrityChoiceEnabled: true,
        celebrityChoiceTitle: 'Celebrity Closet',
        celebrityChoiceSubtitle: 'AS SEEN ON CELEBRITIES',
        heroSlides: [
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
      });
      console.log('Seeded initial site configurations.');
    }
  } catch (error) {
    console.error('Error seeding site settings:', error.message);
  }
};

// @desc    Get website configurations
// @route   GET /api/settings
// @access  Public
// export const getSettings = async (req, res) => {
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      // Create default if missing
      settings = await Settings.create({
        isOfferPopupEnabled: true,
        offerPopupTitle: 'Royal Bridal Season Exclusive',
        offerPopupText: 'Unlock up to 25% off bespoke orders this month. Use code BRIDE25 at checkout.',
        offerPopupDiscountCode: 'BRIDE25',
        offerPopupBgColor: '#7A0C2E',
        isNewArrivalsEnabled: true,
        newArrivalsTitle: "What's New",
        newArrivalsSubtitle: 'JUST ARRIVED',
        isCelebrityChoiceEnabled: true,
        celebrityChoiceTitle: 'Celebrity Closet',
        celebrityChoiceSubtitle: 'AS SEEN ON CELEBRITIES',
        heroSlides: [
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
      });
    } else {
      let updated = false;
      if (!settings.occasionsList || settings.occasionsList.length === 0) {
        settings.occasionsList = [
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
        ];
        updated = true;
      }
      if (updated) {
        await settings.save();
      }
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update website configurations (Admin/SuperAdmin only)
// @route   PUT /api/settings
// @access  Private/Admin
// export const updateSettings = async (req, res) => {
export const updateSettings = async (req, res) => {
  const {
    isOfferPopupEnabled,
    offerPopupTitle,
    offerPopupText,
    offerPopupDiscountCode,
    offerPopupBgColor,
    isNewArrivalsEnabled,
    newArrivalsTitle,
    newArrivalsSubtitle,
    isCelebrityChoiceEnabled,
    celebrityChoiceTitle,
    celebrityChoiceSubtitle,
    heroSlides,
    occasionsList
  } = req.body;

  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
    }

    settings.isOfferPopupEnabled = isOfferPopupEnabled ?? settings.isOfferPopupEnabled;
    settings.offerPopupTitle = offerPopupTitle ?? settings.offerPopupTitle;
    settings.offerPopupText = offerPopupText ?? settings.offerPopupText;
    settings.offerPopupDiscountCode = offerPopupDiscountCode ?? settings.offerPopupDiscountCode;
    settings.offerPopupBgColor = offerPopupBgColor ?? settings.offerPopupBgColor;

    settings.isNewArrivalsEnabled = isNewArrivalsEnabled ?? settings.isNewArrivalsEnabled;
    settings.newArrivalsTitle = newArrivalsTitle ?? settings.newArrivalsTitle;
    settings.newArrivalsSubtitle = newArrivalsSubtitle ?? settings.newArrivalsSubtitle;

    settings.isCelebrityChoiceEnabled = isCelebrityChoiceEnabled ?? settings.isCelebrityChoiceEnabled;
    settings.celebrityChoiceTitle = celebrityChoiceTitle ?? settings.celebrityChoiceTitle;
    settings.celebrityChoiceSubtitle = celebrityChoiceSubtitle ?? settings.celebrityChoiceSubtitle;

    settings.heroSlides = heroSlides ?? settings.heroSlides;
    settings.occasionsList = occasionsList ?? settings.occasionsList;

    const updatedSettings = await settings.save();
    res.json({
      message: 'Site settings updated successfully',
      settings: updatedSettings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
