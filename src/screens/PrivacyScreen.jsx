import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const PrivacyScreen = () => {
  // Function to parse content and split list items
  const parseContent = (content) => {
    // Split content by newlines and filter out empty strings
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    // Identify list items (starting with • or numbers like 1., 2., etc.)
    const parsedItems = lines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('•') || /^\d+\./.test(trimmedLine)) {
        return { type: 'list-item', text: trimmedLine.replace(/^•\s*|\d+\.\s*/, '') };
      }
      return { type: 'paragraph', text: trimmedLine };
    });
    
    return parsedItems;
  };

  const privacyData = [
    {
      heading: 'Privacy Policy',
      content: `This privacy policy has been compiled to better serve those who are concerned with how their 'Personally identifiable information' (PII) is being used online. PII, as used in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.`
    },
    {
      heading: 'What personal information do we collect from the people that visit our blog, website or app?',
      content: `When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, phone number or other details to help you with your experience.`
    },
    {
      heading: 'When do we collect information?',
      content: `We collect information from you when you register on our site or enter information on our site.`
    },
    {
      heading: 'How do we use your information?',
      content: `We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:\n\n• To personalize user's experience and to allow us to deliver the type of content and product offerings in which you are most interested.`
    },
    {
      heading: 'How do we protect visitor information?',
      content: `Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.\n\nWe use regular Malware Scanning.\n\n• We do not use an SSL certificate\n\n• We only provide articles and information, we never ask for personal or private information like email addresses, or credit card numbers.`
    },
    {
      heading: 'Do we use \'cookies\'?',
      content: `You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser (like Internet Explorer) settings. Each browser is a little different, so look at your browser's Help menu to learn the correct way to modify your cookies.\n\nIf you disable cookies off, some features will be disabled that make your site experience more efficient and some of our services will not function properly.`
    },
    {
      heading: 'Third Party Disclosure',
      content: `We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide you with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.\n\nHowever, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.`
    },
    {
      heading: 'Third party links',
      content: `Occasionally, at our discretion, we may include or offer third party products or services on our website. These third party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.`
    },
    {
      heading: 'Google',
      content: `Google's advertising requirements can be summed up by Google's Advertising Principles. They are put in place to provide a positive experience for users. https://support.google.com/adwordspolicy/answer/1316548?hl=en\n\nWe have not enabled Google AdSense on our site but we may do so in the future.`
    },
    {
      heading: 'California Online Privacy Protection Act',
      content: `CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law's reach stretches well beyond California to require a person or company in the United States (and conceivably the world) that operates websites collecting personally identifiable information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals with whom it is being shared, and to comply with this policy. - See more at: http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf`
    },
    {
      heading: 'According to CalOPPA we agree to the following:',
      content: `Users can visit our site anonymously\nOnce this privacy policy is created, we will add a link to it on our home page, or as a minimum on the first significant page after entering our website.\n\nOur Privacy Policy link includes the word 'Privacy', and can be easily be found on the page specified above.\n\nUsers will be notified of any privacy policy changes:\n      • On our Privacy Policy Page\nUsers are able to change their personal information:\n      • By logging in to their account`
    },
    {
      heading: 'How does our site handle do not track signals?',
      content: `We honor do not track signals and do not track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.`
    },
    {
      heading: 'COPPA (Children Online Privacy Protection Act)',
      content: `When it comes to the collection of personal information from children under 13, the Children's Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, the nation's consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children's privacy and safety online.\n\nWe do not specifically market to children under 13.`
    },
    {
      heading: 'Fair Information Practices',
      content: `The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.`
    },
    {
      heading: 'In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:',
      content: `We will notify the users via email\n      • Within 7 business days\nWe will notify the users via in site notification\n      • Within 7 business days\n\nWe also agree to the individual redress principle, which requires that individuals have a right to pursue legally enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or a government agency to investigate and/or prosecute non-compliance by data processors.`
    },
    {
      heading: 'CAN SPAM Act',
      content: `The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.`
    },
    {
      heading: 'We collect your email address in order to:',
      content: `• Send information, respond to inquiries, and/or other requests or questions.`
    },
    {
      heading: 'To be in accordance with CANSPAM we agree to the following:',
      content: `• NOT use false, or misleading subjects or email addresses\n      • Identify the message as an advertisement in some reasonable way\n      • Include the physical address of our business or site headquarters\n      • Monitor third party email marketing services for compliance, if one is used.\n      • Honor opt-out/unsubscribe requests quickly\n      • Allow users to unsubscribe by using the link at the bottom of each email`
    },
    {
      heading: 'If at any time you would like to unsubscribe from receiving future emails, you can email us at',
      content: `• Follow the instructions at the bottom of each email.\nand we will promptly remove you from ALL correspondence.`
    },
    {
      heading: 'Contacting Us',
      content: `• Follow the instructions at the bottom of each email.\nand we will promptly remove you from ALL correspondence.\n\nNaamee\n163 Queen Street\nAuckland\n1010\nNew Zealand\nnaameeapp@gmail.com\n\nLast Edited on 2021-11-11`
    }
  ];

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="w-full bg-white"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {privacyData.map((item, index) => (
          <View key={index} className="mb-6">
            <Text className="text-lg text-black font-bold mb-2">
              {item.heading}
            </Text>
            {parseContent(item.content).map((contentItem, contentIndex) => (
              <View key={contentIndex} className={contentItem.type === 'list-item' ? 'flex-row mb-1' : 'mb-2'}>
                {contentItem.type === 'list-item' && (
                  <Text className="text-3xl leading-[1] text-black mr-2">•</Text>
                )}
                <Text
                  className={`text-base text-black ${contentItem.type === 'list-item' ? 'flex-1' : ''}`}
                >
                  {contentItem.text}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PrivacyScreen;