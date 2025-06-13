import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traducciones
const resources = {
  en: {
    translation: {
      // Common
      common: {
        loading: "Loading...",
        error: "Error",
        retry: "Retry",
        save: "Save",
        cancel: "Cancel",
        confirm: "Confirm",
        submit: "Submit",
        submitting: "Submitting...",
        creating: "Creating...",
        updating: "Updating...",
        deleting: "Deleting...",
        next: "Next",
        previous: "Previous",
        viewDetails: "View Details",
        viewAll: "View All",
        donate: "Donate",
        clear: "Clear",
        clearFilters: "Clear Filters",
        refresh: "Refresh",
        optional: "optional",
        anonymousUser: "Anonymous User",
        emailNotAvailable: "Email not available",
        locationNotSpecified: "Location not specified",
        edit: "Edit",
        delete: "Delete",
        close: "Close",
        search: "Search",
        filter: "Filter",
        sort: "Sort",
        date: "Date",
        location: "Location",
        description: "Description",
        name: "Name",
        email: "Email",
        phone: "Phone",
        address: "Address",
        website: "Website",
        required: "Required",
        yes: "Yes",
        no: "No",
        create: "Create",
        update: "Update",
        processing: "Processing...",
        download: "Download",
        upload: "Upload",
        loginShort: "Log In",
        loginRequiredToViewParticipations: "Debes iniciar sesión para ver tus participaciones"
      },
      // Navigation
      nav: {
        home: "Home",
        foundations: "Foundations",
        opportunities: "Opportunities",
        about: "About",
        login: "Login",
        register: "Register",
        logout: "Logout",
        profile: "Profile",
        myParticipations: "My Participations",
        myDonations: "My Donations",
        certificates: "Certificates",
        favorites: "Favorites",
        dashboard: "Dashboard",
        createOpportunity: "Create Opportunity",
        reports: "Reports",
        suggestions: "Suggestions",
        notifications: "Notifications",
        sendSuggestion: "Send Suggestion"
      },
      // Home
      home: {
        heroTitle: "Connecting caring",
        heroSubtitle: "Find volunteer opportunities and support causes that matter",
        getStarted: "Get Started",
        learnMore: "Learn More",
        findOpportunities: "Find Opportunities",
        discoverFoundations: "Discover Foundations",
        ourImpact: "Our Impact",
        impactDescription: "Together we make a difference in our community",
        foundations: "Foundations",
        opportunities: "Opportunities",
        donations: "Donations",
        volunteers: "Volunteers",
        featuredFoundations: "Featured Foundations",
        foundationsDescription: "Organizations committed to social change",
        activeOpportunities: "Active Opportunities",
        opportunitiesDescription: "Ways to contribute to your community",
        ctaTitle: "Ready to make a difference?",
        ctaDescription: "Join our community and start changing lives today",
        joinToday: "Join Today",
        startHelping: "Start Helping",
        createOpportunity: "Create Opportunity",
        leadingVolunteerPlatform: "✨ Leading platform in social volunteering",
        solidarity: "hearts",
        viewAll: "View All",
      },
      // About
      about: {
        hero: {
          title: "Our mission",
          subtitle: "Connecting generous people with causes that matter",
          cta: "Join now",
          imageAlt: "People helping in the community"
        },
        mission: {
          title: "Mission",
          description: "To facilitate connections between people who want to help and organizations that need support, creating a positive impact on society."
        },
        vision: {
          title: "Vision",
          description: "To be the leading platform that inspires and empowers people to actively participate in social change."
        },
        features: {
          title: "What we offer",
          subtitle: "Tools to connect and collaborate",
          connect: {
            title: "Connect",
            description: "Find volunteer opportunities that align with your interests and availability."
          },
          donate: {
            title: "Donate",
            description: "Financially support organizations that are making a difference."
          },
          certificates: {
            title: "Certificates",
            description: "Get recognized for your volunteer work and build your social impact portfolio."
          },
          transparency: {
            title: "Transparency",
            description: "Access detailed reports on how donations are used and the impact generated."
          }
        },
        stats: {
          users: "Registered users",
          foundations: "Foundations",
          opportunities: "Opportunities",
          donated: "Donated"
        },
        team: {
          title: "Our team",
          subtitle: "The people behind the platform",
          founder: "Founder",
          founder1: "Founder",
          techLead: "Tech Lead",
          communityManager: "Community Manager",
          marco: {
            description: "Visionary passionate about social impact and technology for good."
          },
          alejandra: {
            description: "Development expert with experience in high-impact platforms."
          },
          juandiego: {
            description: "Specialist in building and nurturing engaged communities."
          }
          ,
          laura: {
            description: "Specialist in building and nurturing engaged communities."
          },
          francois: {
            description: "Specialist in building and nurturing engaged communities."
          }
        },
        cta: {
          title: "Ready to get started?",
          subtitle: "Join our community and start making a difference",
          join: "Join free",
          explore: "Explore foundations"
        }
      },
      // Login
      login: {
        title: "Log In",
        subtitle: "Access your account",
        email: "Email",
        emailPlaceholder: "your@email.com",
        password: "Password",
        passwordPlaceholder: "Your password",
        submit: "Log In",
        invalidCredentials: "Invalid credentials",
        noAccount: "Don't have an account?",
        register: "Register here"
      },
      // Register
      register: {
        title: "Create Account",
        subtitle: "Join our community",
        individual: "Individual",
        foundation: "Foundation",
        firstName: "First Name",
        lastName: "Last Name",
        foundationName: "Foundation Name",
        address: "Address",
        phone: "Phone",
        website: "Website",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        submit: "Register",
        passwordMismatch: "Passwords don't match",
        userCreationError: "Error creating user",
        loginError: "Error logging in",
        foundationCreationError: "Error creating foundation",
        success: "Account created successfully",
        hasAccount: "Already have an account?",
        login: "Log in here"
      },
      // Foundations
      foundations: {
        title: "Foundations",
        subtitle: "Discover organizations making a difference",
        loading: "Loading foundations...",
        fetchError: "Error loading foundations",
        searchPlaceholder: "Search foundations...",
        locationPlaceholder: "Location...",
        sortByName: "By name",
        sortByNewest: "Newest",
        sortByOldest: "Oldest",
        showingResults: "Showing {{start}}-{{end}} of {{total}} foundations",
        noResults: "No foundations found",
        tryDifferentSearch: "Try different search terms",
        verified: "Verified",
        noDescription: "No description available"
      },
      // Foundation Details
      foundation: {
        notFound: "Foundation not found",
        website: "Website",
        donate: "Donate",
        totalOpportunities: "Total opportunities",
        activeOpportunities: "Active opportunities",
        totalDonations: "Total donated",
        foundedIn: "Founded in",
        about: "About",
        aboutTitle: "About this foundation",
        noDescription: "No description available",
        contactInfo: "Contact information",
        legalName: "Legal name",
        address: "Address",
        phone: "Phone",
        opportunities: "Opportunities",
        noOpportunities: "No opportunities available",
        noOpportunitiesDescription: "This foundation has no active opportunities at the moment",
        reviews: "Reviews",
        setupRequired: "Setup required",
        setupDescription: "Complete your foundation setup to continue",
        completeSetup: "Complete setup",
        dashboard: "Dashboard",
        welcomeBack: "Welcome back, {{name}}",
        createOpportunity: "Create opportunity",
        settings: "Settings",
        overview: "Overview",
        recentOpportunities: "Recent opportunities",
        pendingApplications: "Pending applications",
        recentDonations: "Recent donations",
        recentNotifications: "Recent notifications",
        createFirst: "Create first",
        noPendingApplications: "No pending applications",
        noDonations: "No donations",
        review: "Review",
        foundedYear: "Founded year"
      },
      // Foundation Setup
      foundationSetup: {
        title: "Foundation Setup",
        subtitle: "Complete your foundation information",
        step: "Step",
        of: "of",
        updating: "Updating...",
        step1: {
          title: "Basic information"
        },
        step2: {
          title: "Additional information"
        },
        legalName: "Legal name",
        legalNamePlaceholder: "Example Foundation",
        phone: "Phone",
        phonePlaceholder: "+1 123 456 7890",
        address: "Address",
        addressPlaceholder: "123 Main St, City",
        website: "Website",
        description: "Description",
        descriptionPlaceholder: "Describe your foundation's mission and activities...",
        logo: "Logo",
        complete: "Complete setup",
        errors: {
          requiredFields: "All required fields must be completed",
          updateFailed: "Error updating foundation"
        }
      },
      // Opportunities
      opportunities: {
        title: "Volunteer Opportunities",
        subtitle: "Find ways to contribute to your community",
        loading: "Loading opportunities...",
        fetchError: "Error loading opportunities",
        searchPlaceholder: "Search opportunities...",
        showingResults: "Showing {{start}}-{{end}} of {{total}} opportunities",
        noResults: "No opportunities found",
        tryDifferentSearch: "Try different search terms",
        active: "Active",
        upcoming: "Upcoming",
        ended: "Ended",
        apply: "Apply",
        foundation: "Foundation",
        noDescription: "No description available"
      },
      // Opportunity Details
      opportunity: {
        manageParticipants: "Manage Participants",
        notFound: "Opportunity not found",
        foundationsCannotApply: "Foundations cannot apply to opportunities",
        applicationError: "Error submitting application",
        applicationSuccess: "Application submitted successfully",
        description: "Description",
        details: "Details",
        startDate: "Start date",
        endDate: "End date",
        location: "Location",
        contact: "Contact",
        actions: "Actions",
        apply: "Apply",
        viewFoundation: "View foundation",
        supportFoundation: "Support foundation",
        shareOpportunity: "Share opportunity",
        aboutFoundation: "About the foundation",
        applicationForm: "Application form",
        applicationMessage: "Application message",
        applicationPlaceholder: "Tell us why you're interested in this opportunity...",
        applicationHint: "Optional: share your motivation and relevant experience",
        submitApplication: "Submit application",
        reviews: "reviews",
        title: "Title",
        view: "View",
        edit: "Edit",
        foundationRequired: "Foundation information required",
        createError: "Error creating opportunity",
        createSuccess: "Opportunity created successfully",
        create: "Create opportunity",
        createSubtitle: "Post a new volunteer opportunity",
        titlePlaceholder: "E.g.: Community park cleanup",
        descriptionPlaceholder: "Describe the activity and what volunteers will be doing...",
        startTime: "Start time",
        endTime: "End time",
        locationPlaceholder: "E.g.: Central Park, City",
        requirements: "Requirements",
        requirementsPlaceholder: "E.g.: Must be 18+, half-day availability...",
        volunteersNeeded: "Volunteers needed",
        volunteersNeededPlaceholder: "E.g.: 20",
        contactInfo: "Contact information",
        contactInfoPlaceholder: "E.g.: coordinator@foundation.org"
      },
      // Create/Edit Opportunity
      createOpportunity: {
        title: "Create New Opportunity",
        subtitle: "Create a volunteer opportunity for your foundation",
        create: "Create Opportunity",
        createSuccess: "Opportunity created successfully!",
        createError: "Error creating opportunity",
        foundationRequired: "Foundation setup required to create opportunities"
      },
      editOpportunity: {
        title: "Edit Opportunity",
        loading: "Loading opportunity...",
        saving: "Saving...",
        save: "Save Changes",
        titlePlaceholder: "Opportunity title",
        descriptionPlaceholder: "Describe the activity...",
        locationPlaceholder: "Activity location",
        requiredSkills: "Required skills",
        requiredSkillsPlaceholder: "E.g.: Communication, teamwork",
        volunteersNeeded: "Volunteers needed",
        contactEmail: "Contact email",
        image: "Image",
        errors: {
          fetchFailed: "Error loading opportunity",
          updateFailed: "Error updating opportunity"
        }
      },
      // Participants
      participants: {
        readOnlyView: "Read-only View",
        readOnlyMode: "Read-only Mode",
        title: "Manage Participants",
        manage: "Manage participants",
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected",
        total: "Total",
        noPending: "No pending applications",
        noPendingDescription: "No applications for this opportunity yet",
        noAccepted: "No accepted participants",
        noAcceptedDescription: "No participants accepted yet",
        noRejected: "No rejected applications",
        noRejectedDescription: "No applications rejected",
        appliedOn: "Applied on",
        message: "Message",
        accept: "Accept",
        reject: "Reject",
        generateCertificate: "Generate certificate",
        statusChangeError: "Error changing status"
      },
      // Participations
      participations: {
        title: "My Participations",
        subtitle: "History of volunteer applications",
        fetchError: "Error loading participations",
        pending: "Pending",
        accepted: "Accepted",
        rejected: "Rejected",
        all: "All",
        total: "Total",
        noParticipations: "No participations",
        noParticipationsDescription: "You haven't applied to any opportunities yet",
        findOpportunities: "Find opportunities",
        appliedOn: "Applied on",
        acceptedOn: "Accepted on",
        opportunity: "Opportunity",
        noPending: "No pending applications",
        noAccepted: "No accepted participations",
        appliedOnn: "Applied on {{date}}",
        messageLabel: "Message:",
        noPendingParticipations: "No pending participations",
        noAcceptedParticipations: "No accepted participations",
        acceptedOnn: "Accepted on {{date}}"
      },
      // Donations
      donations: {
        title: "My Donations",
        subtitle: "History of donations made",
        fetchError: "Error loading donations",
        amount: "Amount",
        donor: "Donor",
        date: "Date",
        type: "Type",
        totalDonated: "Total donated",
        totalDonations: "Total donations",
        monthlyDonations: "Monthly donations",
        noDonations: "No donations",
        noDonationsDescription: "You haven't made any donations yet",
        startDonating: "Start donating",
        monthly: "Monthly",
        oneTime: "One time",
        anonymous: "Anonymous",
        dedication: "Dedication",
        rateDonation: "Rate donation",
        rateDescription: "Rate your experience with {{foundation}}",
        yourRating: "Your rating",
        submitRating: "Submit rating",
        ratingSuccess: "Rating submitted successfully",
        ratingError: "Error submitting rating",
        commentDonation: "Comment donation",
        shareExperience: "Share your experience",
        commentPlaceholder: "Write your comment about this donation...",
        submitComment: "Submit comment",
        commentSuccess: "Comment submitted successfully",
        commentError: "Error submitting comment",
        rate: "Rate",
        comment: "Comment",
        contributionHistory: "Your contribution history",
        noDonationsMade: "You haven't made any donations yet",
        donationExperiencePlaceholder: "Tell us about your experience donating to this foundation..."
      },
      // Donate
      donate: {
        title: "Make Donation",
        selectAmount: "Select amount",
        customAmount: "Custom amount",
        customAmountPlaceholder: "Enter amount",
        monthlyDonation: "Monthly donation",
        monthlyDescription: "Make a recurring donation every month",
        donorName: "Donor name",
        donorEmail: "Donor email",
        dedication: "Dedication (optional)",
        dedicationPlaceholder: "In honor of...",
        paymentMethod: "Payment method",
        selectPaymentMethod: "Select payment method",
        creditCard: "Credit card",
        debitCard: "Debit card",
        bankTransfer: "Bank transfer",
        summary: "Summary",
        amount: "Amount",
        frequency: "Frequency",
        monthly: "Monthly",
        beneficiary: "Beneficiary",
        submitDonation: "Donate {{amount}}",
        processing: "Processing...",
        securityNote: "Your information is protected and secure",
        invalidAmount: "Invalid amount",
        processingError: "Error processing donation",
        successMessage: "Donation of {{amount}} to {{foundation}} completed successfully"
      },
      // Certificates
      certificates: {
        title: "My Certificates",
        subtitle: "You have {{count}} certificates",
        fetchError: "Error loading certificates",
        downloadError: "Error downloading certificate",
        noCertificates: "No certificates",
        noCertificatesDescription: "Participate in opportunities to earn certificates",
        participateToEarn: "Participate in opportunities",
        participationCertificate: "Participation certificate",
        defaultDescription: "This certificate recognizes participation in volunteer activities",
        issuedOn: "Issued on",
        socialAction: "Social action",
        download: "Download",
        generate: "Generate certificate",
        generateError: "Error generating certificate",
        generateSuccess: "Certificate generated successfully",
        description: "Description",
        descriptionPlaceholder: "Certificate description...",
        participant: "Participant",
        loginRequiredToViewCertificates: "You must log in to view your certificates"
      },
      // Favorites
      favorites: {
        title: "My Favorites",
        subtitle: "You have {{count}} favorite item",
        subtitle_plural: "You have {{count}} favorite items",
        fetchError: "Error loading favorites",
        all: "All",
        foundations: "Foundations",
        opportunities: "Opportunities",
        noFavorites: "No favorites",
        noFavoritesDescription: "Add foundations and opportunities to your favorites",
        exploreFoundations: "Explore foundations",
        exploreOpportunities: "Explore opportunities",
        noFoundationFavorites: "No favorite foundations",
        noFoundationFavoritesDescription: "Explore and add foundations to your favorites",
        noOpportunityFavorites: "No favorite opportunities",
        noOpportunityFavoritesDescription: "Explore and add opportunities to your favorites",
        loginRequired: "Log in to add favorites"
      },
      // Notifications
      notifications: {
        title: "Notifications",
        subtitle: "{{total}} notifications ({{unread}} unread)",
        fetchError: "Error loading notifications",
        markAllAsRead: "Mark all as read",
        markAsRead: "Mark as read",
        noNotifications: "No notifications",
        noNotificationsDescription: "We'll notify you about important activities",
        new: "New"
      },
      // Comments
      comments: {
        title: "Comments and ratings",
        loginRequired: "Log in to comment",
        rating: "Rating",
        writeComment: "Write a comment",
        placeholder: "Share your experience...",
        submit: "Submit comment",
        submitError: "Error submitting comment",
        noComments: "No comments yet"
      },
      // Profile
      profile: {
        userNotFound: "User not found",
        updateError: "Error updating profile",
        memberSince: "Member since",
        editProfile: "Edit profile",
        donations: "Donations",
        participations: "Participations",
        certificates: "Certificates",
        noDonations: "No donations",
        startDonating: "Start donating to support causes",
        findFoundations: "Find foundations",
        noParticipations: "No participations",
        startVolunteering: "Start volunteering",
        findOpportunities: "Find opportunities",
        noCertificates: "No certificates",
        earnCertificates: "Participate in opportunities to earn certificates",
        publicProfile: "Public profile",
        limitedInfo: "Public information is limited",
        opportunity: "Opportunity",
        appliedOn: "Applied on",
        activeActivities: "Active Activities",
        noActiveActivities: "No active activities",
        noCurrentParticipation: "is not participating in any activity at the moment.",
        profileInfo: "Profile Information",
        publicInfoDescription: "This is the public information available about "
      },
      // Search
      search: {
        title: "Search",
        subtitle: "Find foundations and opportunities",
        placeholder: "Search foundations and opportunities...",
        searching: "Searching...",
        resultsFor: "Results for",
        noResults: "No results found",
        noResultsMessage: "Try different search terms",
        clearSearch: "Clear search",
        tabs: {
          all: "All",
          foundations: "Foundations",
          opportunities: "Opportunities"
        },
        tips: {
          title: "Search tips",
          subtitle: "Find exactly what you're looking for",
          foundations: "Foundations",
          foundationsDescription: "Search by name, location or cause",
          opportunities: "Opportunities",
          opportunitiesDescription: "Search by activity, date or location",
          location: "Location",
          locationDescription: "Filter by specific city or region"
        }
      },
      // Filters
      filters: {
        title: "Filters",
        status: "Status",
        allStatuses: "All statuses",
        location: "Location",
        locationPlaceholder: "Filter by location",
        startDate: "Start date",
        endDate: "End date",
        clear: "Clear filters"
      },
      // File Upload
      fileUpload: {
        selectFile: "Select file",
        maxSize: "Max size",
        sizeTooLarge: "File too large"
      },
      // Create Suggestion
      createSuggestion: {
        title: "Send suggestion",
        subtitle: "Help us improve the platform",
        category: "Category",
        selectCategory: "Select a category",
        categories: {
          platform: "Platform",
          foundations: "Foundations",
          opportunities: "Opportunities",
          donations: "Donations",
          certificates: "Certificates",
          other: "Other"
        },
        categoryHelp: "Select the category that best describes your suggestion",
        content: "Suggestion",
        contentPlaceholder: "Describe your suggestion in detail...",
        characters: "characters",
        anonymous: "Send anonymously",
        anonymousHelp: "Your name won't be associated with this suggestion",
        guidelines: {
          title: "Suggestion guidelines",
          specific: "Be specific and detailed",
          constructive: "Keep a constructive tone",
          respectful: "Be respectful to the community",
          implementable: "Propose implementable ideas"
        },
        submit: "Send suggestion",
        submitting: "Sending...",
        success: {
          title: "Suggestion sent successfully",
          message: "Thank you for helping us improve. We'll review your suggestion soon."
        },
        errors: {
          loginRequired: "You must log in to send suggestions",
          submitFailed: "Error sending suggestion"
        },
        info: {
          improve: {
            title: "Help improve",
            description: "Your ideas help us create a better experience for everyone"
          },
          community: {
            title: "Build community",
            description: "Together we can make this platform a better place"
          },
          impact: {
            title: "Generate impact",
            description: "Your participation makes a difference in our mission"
          }
        }
      },
      // Suggestions Received
      suggestionsReceived: {
        title: "Suggestions received",
        subtitle: "Manage community suggestions",
        loading: "Loading suggestions...",
        filters: {
          all: "All suggestions",
          unprocessed: "Unprocessed",
          processed: "Processed"
        },
        stats: {
          total: "Total suggestions",
          pending: "Unprocessed",
          processed: "Processed"
        },
        noSuggestions: "No suggestions",
        noSuggestionsMessage: "You haven't received community suggestions yet",
        processed: "Processed",
        pending: "Pending",
        markAsProcessed: "Mark as processed",
        markAsProcessedMessage: "Are you sure you want to mark this suggestion as processed?",
        suggestion: "Suggestion",
        response: "Response",
        responsePlaceholder: "Write an optional response...",
        confirm: "Confirm",
        confirmDelete: "Are you sure you want to delete this suggestion?",
        errors: {
          fetchFailed: "Error loading suggestions",
          markFailed: "Error marking as processed",
          deleteFailed: "Error deleting suggestion"
        }
      },
      // Reports
      reports: {
        title: "Reports and analytics",
        subtitle: "Statistics and metrics for your foundation",
        loading: "Loading reports...",
        refresh: "Refresh",
        totalDonations: "Total donations",
        totalOpportunities: "Total opportunities",
        totalParticipants: "Total participants",
        certificatesIssued: "Certificates issued",
        tabs: {
          donations: "Donations",
          participation: "Participation"
        },
        donationsByCategory: "Donations by category",
        donationsByDay: "Donations by day",
        participantsByOpportunity: "Participants by opportunity",
        monthlyGrowth: "Monthly growth",
        totalApplications: "Total applications",
        acceptedApplications: "Accepted applications",
        donationAmount: "Donation amount",
        donationCount: "Donation count"
      },
      // Not Found
      notFound: {
        title: "Page not found",
        message: "Sorry, the page you're looking for doesn't exist",
        goHome: "Go home",
        goBack: "Go back",
        helpfulLinks: "Helpful links",
        links: {
          foundations: "Foundations",
          foundationsDescription: "Explore charitable organizations",
          opportunities: "Opportunities",
          opportunitiesDescription: "Find ways to help",
          about: "About",
          aboutDescription: "Learn more about us",
          search: "Search",
          searchDescription: "Find what you're looking for"
        }
      },
      // Footer
      footer: {
        description: "Platform connecting generous people with causes that matter.",
        explore: "Explore",
        foundations: "Foundations",
        opportunities: "Opportunities",
        search: "Search",
        company: "Company",
        about: "About",
        contact: "Contact",
        careers: "Careers",
        support: "Support",
        help: "Help",
        privacy: "Privacy",
        terms: "Terms",
        community: "Community",
        suggestions: "Suggestions",
        blog: "Blog",
        newsletter: "Newsletter",
        allRights: "All rights reserved.",
        madeWith: "Made ",
        inColombia: "in Colombia"
      },
      // Categories
      social: {
        title: "Social Area",
        description: "Initiatives for social and community development",
        communitySupport: "Community support",
        socialInclusion: "Social inclusion",
        povertyReduction: "Poverty reduction",
        humanRights: "Human rights",
        genderEquality: "Gender equality",
        childProtection: "Child protection",
        elderlycare: "Elderly care",
        disabilitySupport: "Disability support",
        refugeeAssistance: "Refugee assistance",
        homelessness: "Homelessness support",
        socialJustice: "Social justice",
        communityDevelopment: "Community development"
      },
      events: {
        title: "Events",
        description: "Social activities and events",
        fundraising: "Fundraising",
        volunteering: "Volunteering",
        awareness: "Awareness",
        community: "Community",
        charity: "Charity",
        workshop: "Workshop",
        seminar: "Seminar",
        conference: "Conference",
        festival: "Festival",
        marathon: "Marathon",
        auction: "Charity auction",
        gala: "Charity gala",
        cleanup: "Cleanup drive",
        bloodDrive: "Blood drive"
      },
      environmental: {
        title: "Environment",
        description: "Conservation and environmental protection",
        climateChange: "Climate change",
        conservation: "Conservation",
        sustainability: "Sustainability",
        recycling: "Recycling",
        reforestation: "Reforestation",
        pollution: "Pollution",
        biodiversity: "Biodiversity",
        renewableEnergy: "Renewable energy",
        waterProtection: "Water protection",
        wildlife: "Wildlife",
        greenSpaces: "Green spaces",
        ecoEducation: "Environmental education",
        carbonFootprint: "Carbon footprint",
        organicFarming: "Organic farming"
      },
      education: {
        title: "Education",
        description: "Educational opportunities and academic development",
        literacy: "Literacy",
        scholarship: "Scholarships",
        tutoring: "Tutoring",
        mentorship: "Mentorship",
        digitalLiteracy: "Digital literacy",
        vocationalTraining: "Vocational training",
        earlyChildhood: "Early childhood",
        adultEducation: "Adult education",
        specialNeeds: "Special needs",
        stemEducation: "STEM education",
        artEducation: "Arts education",
        languageLearning: "Language learning",
        lifeSkills: "Life skills",
        financialLiteracy: "Financial literacy"
      },
      health: {
        title: "Health",
        description: "Wellness and healthcare",
        mentalHealth: "Mental health",
        physicalHealth: "Physical health",
        prevention: "Prevention",
        nutrition: "Nutrition",
        healthcare: "Healthcare",
        vaccination: "Vaccination",
        maternalHealth: "Maternal health",
        childHealth: "Child health",
        addiction: "Addiction",
        chronicDiseases: "Chronic diseases",
        rehabilitation: "Rehabilitation",
        emergencycare: "Emergency care",
        publicHealth: "Public health",
        healthEducation: "Health education"
      },
      arts: {
        title: "Arts and Culture",
        description: "Promoting artistic and cultural expressions",
        visualArts: "Visual arts",
        performingArts: "Performing arts",
        music: "Music",
        theater: "Theater",
        dance: "Dance",
        literature: "Literature",
        film: "Film",
        photography: "Photography",
        sculpture: "Sculpture",
        painting: "Painting",
        crafts: "Crafts",
        culturalHeritage: "Cultural heritage",
        artTherapy: "Art therapy",
        publicArt: "Public art"
      }
    }
  },
  es: {
    translation: {
      // Common
      common: {
        loading: "Cargando...",
        error: "Error",
        retry: "Reintentar",
        save: "Guardar",
        cancel: "Cancelar",
        confirm: "Confirmar",
        submit: "Enviar",
        submitting: "Enviando...",
        creating: "Creando...",
        updating: "Actualizando...",
        deleting: "Eliminando...",
        next: "Siguiente",
        previous: "Anterior",
        viewDetails: "Ver detalles",
        viewAll: "Ver todos",
        donate: "Donar",
        clear: "Limpiar",
        clearFilters: "Limpiar filtros",
        refresh: "Actualizar",
        optional: "opcional",
        anonymousUser: "Usuario anónimo",
        emailNotAvailable: "Email no disponible",
        locationNotSpecified: "Ubicación no especificada",
        edit: "Editar",
        delete: "Eliminar",
        close: "Cerrar",
        search: "Buscar",
        filter: "Filtrar",
        sort: "Ordenar",
        date: "Fecha",
        location: "Ubicación",
        description: "Descripción",
        name: "Nombre",
        email: "Email",
        phone: "Teléfono",
        address: "Dirección",
        website: "Sitio Web",
        required: "Requerido",
        yes: "Sí",
        no: "No",
        create: "Crear",
        update: "Actualizar",
        processing: "Procesando...",
        download: "Descargar",
        upload: "Subir",
        loginShort: "Inicia Sesión",
        loginRequiredToViewParticipations: "You must log in to view your participations"
      },
      // Navigation
      nav: {
        home: "Inicio",
        foundations: "Fundaciones",
        opportunities: "Oportunidades",
        about: "Acerca de",
        login: "Iniciar sesión",
        register: "Registrarse",
        logout: "Cerrar sesión",
        profile: "Perfil",
        myParticipations: "Mis participaciones",
        myDonations: "Mis donaciones",
        certificates: "Certificados",
        favorites: "Favoritos",
        dashboard: "Panel de control",
        createOpportunity: "Crear oportunidad",
        reports: "Reportes",
        suggestions: "Sugerencias",
        notifications: "Notificaciones",
        sendSuggestion: "Enviar sugerencia"
      },
      // Home
      home: {
        heroTitle: "Conectando corazones",
        heroSubtitle: "Encuentra oportunidades de voluntariado y apoya causas que importan",
        getStarted: "Comenzar",
        learnMore: "Conoce más",
        findOpportunities: "Buscar oportunidades",
        discoverFoundations: "Descubrir fundaciones",
        ourImpact: "Nuestro impacto",
        impactDescription: "Unidos marcamos la diferencia en nuestra comunidad",
        foundations: "Fundaciones",
        opportunities: "Oportunidades",
        donations: "Donaciones",
        volunteers: "Voluntarios",
        featuredFoundations: "Fundaciones destacadas",
        foundationsDescription: "Organizaciones comprometidas con el cambio social",
        activeOpportunities: "Oportunidades activas",
        opportunitiesDescription: "Formas de contribuir a tu comunidad",
        ctaTitle: "¿Listo para hacer la diferencia?",
        ctaDescription: "Únete a nuestra comunidad y comienza a cambiar vidas hoy",
        joinToday: "Únete hoy",
        startHelping: "Comenzar a ayudar",
        createOpportunity: "Crear oportunidad",
        leadingVolunteerPlatform: "✨ Plataforma líder en voluntariado social",
        solidarity: "solidarios",
        viewAll: "Ver todo"
      },
      // About
      about: {
        hero: {
          title: "Nuestra misión",
          subtitle: "Conectamos personas generosas con causas que importan",
          cta: "Únete ahora",
          imageAlt: "Personas ayudando en la comunidad"
        },
        mission: {
          title: "Misión",
          description: "Facilitar la conexión entre personas que quieren ayudar y organizaciones que necesitan apoyo, creando un impacto positivo en la sociedad."
        },
        vision: {
          title: "Visión",
          description: "Ser la plataforma líder que inspire y empodere a las personas a participar activamente en el cambio social."
        },
        features: {
          title: "Lo que ofrecemos",
          subtitle: "Herramientas para conectar y colaborar",
          connect: {
            title: "Conecta",
            description: "Encuentra oportunidades de voluntariado que se alineen con tus intereses y disponibilidad."
          },
          donate: {
            title: "Dona",
            description: "Apoya financieramente a las organizaciones que están marcando la diferencia."
          },
          certificates: {
            title: "Certificados",
            description: "Obtén reconocimiento por tu trabajo voluntario y construye tu portafolio de impacto social."
          },
          transparency: {
            title: "Transparencia",
            description: "Accede a reportes detallados sobre cómo se utilizan las donaciones y el impacto generado."
          }
        },
        stats: {
          users: "Usuarios registrados",
          foundations: "Fundaciones",
          opportunities: "Oportunidades",
          donated: "Donado"
        },
        team: {
          title: "Nuestro equipo",
          subtitle: "Las personas detrás de la plataforma",
          founder: "Fundador",
          founder1: "Fundadora",
          techLead: "Líder técnico",
          communityManager: "Gestora de comunidad",
          marco: {
            description: "Visionaria apasionada por el impacto social y la tecnología para el bien."
          },
          alejandra: {
            description: "Experto en desarrollo con experiencia en plataformas de alto impacto."
          },
          juandiego: {
            description: "Especialista en construir y nutrir comunidades comprometidas."
          }
          ,
          laura: {
            description: "Especialista en construir y nutrir comunidades comprometidas."
          },
          francois: {
            description: "Especialista en construir y nutrir comunidades comprometidas."
          }
        },
        cta: {
          title: "¿Listo para comenzar?",
          subtitle: "Únete a nuestra comunidad y comienza a hacer la diferencia",
          join: "Únete gratis",
          explore: "Explorar fundaciones"
        }
      },
      // Login
      login: {
        title: "Iniciar sesión",
        subtitle: "Accede a tu cuenta",
        email: "Correo electrónico",
        emailPlaceholder: "tu@email.com",
        password: "Contraseña",
        passwordPlaceholder: "Tu contraseña",
        submit: "Iniciar sesión",
        invalidCredentials: "Credenciales inválidas",
        noAccount: "¿No tienes cuenta?",
        register: "Regístrate aquí"
      },
      // Register
      register: {
        title: "Crear cuenta",
        subtitle: "Únete a nuestra comunidad",
        individual: "Individual",
        foundation: "Fundación",
        firstName: "Nombre",
        lastName: "Apellido",
        foundationName: "Nombre de la fundación",
        address: "Dirección",
        phone: "Teléfono",
        website: "Sitio web",
        email: "Correo electrónico",
        password: "Contraseña",
        confirmPassword: "Confirmar contraseña",
        submit: "Registrarse",
        passwordMismatch: "Las contraseñas no coinciden",
        userCreationError: "Error al crear usuario",
        loginError: "Error al iniciar sesión",
        foundationCreationError: "Error al crear fundación",
        success: "Cuenta creada exitosamente",
        hasAccount: "¿Ya tienes cuenta?",
        login: "Inicia sesión aquí"
      },
      // Foundations
      foundations: {
        title: "Fundaciones",
        subtitle: "Descubre organizaciones que están marcando la diferencia",
        loading: "Cargando fundaciones...",
        fetchError: "Error al cargar fundaciones",
        searchPlaceholder: "Buscar fundaciones...",
        locationPlaceholder: "Ubicación...",
        sortByName: "Por nombre",
        sortByNewest: "Más recientes",
        sortByOldest: "Más antiguas",
        showingResults: "Mostrando {{start}}-{{end}} de {{total}} fundaciones",
        noResults: "No se encontraron fundaciones",
        tryDifferentSearch: "Intenta con otros términos de búsqueda",
        verified: "Verificada",
        noDescription: "Sin descripción disponible"
      },
      // Foundation Details
      foundation: {
        notFound: "Fundación no encontrada",
        website: "Sitio web",
        donate: "Donar",
        totalOpportunities: "Total de oportunidades",
        activeOpportunities: "Oportunidades activas",
        totalDonations: "Total donado",
        foundedIn: "Fundada en",
        about: "Acerca de",
        aboutTitle: "Sobre esta fundación",
        noDescription: "No hay descripción disponible",
        contactInfo: "Información de contacto",
        legalName: "Nombre legal",
        address: "Dirección",
        phone: "Teléfono",
        opportunities: "Oportunidades",
        noOpportunities: "No hay oportunidades disponibles",
        noOpportunitiesDescription: "Esta fundación no tiene oportunidades activas en este momento",
        reviews: "Reseñas",
        setupRequired: "Configuración requerida",
        setupDescription: "Completa la configuración de tu fundación para continuar",
        completeSetup: "Completar configuración",
        dashboard: "Panel de control",
        welcomeBack: "Bienvenido de vuelta, {{name}}",
        createOpportunity: "Crear oportunidad",
        settings: "Configuración",
        overview: "Resumen",
        recentOpportunities: "Oportunidades recientes",
        pendingApplications: "Solicitudes pendientes",
        recentDonations: "Donaciones recientes",
        recentNotifications: "Notificaciones recientes",
        createFirst: "Crear primera",
        noPendingApplications: "No hay solicitudes pendientes",
        noDonations: "No hay donaciones",
        review: "Revisar",
        foundedYear: "Año de fundación"
      },
      // Foundation Setup
      foundationSetup: {
        title: "Configurar fundación",
        subtitle: "Completa la información de tu fundación",
        step: "Paso",
        of: "de",
        updating: "Actualizando...",
        step1: {
          title: "Información básica"
        },
        step2: {
          title: "Información adicional"
        },
        legalName: "Nombre legal",
        legalNamePlaceholder: "Fundación Ejemplo",
        phone: "Teléfono",
        phonePlaceholder: "+57 123 456 7890",
        address: "Dirección",
        addressPlaceholder: "Calle 123 #45-67, Bogotá",
        website: "Sitio web",
        description: "Descripción",
        descriptionPlaceholder: "Describe la misión y actividades de tu fundación...",
        logo: "Logo",
        complete: "Completar configuración",
        errors: {
          requiredFields: "Todos los campos requeridos deben ser completados",
          updateFailed: "Error al actualizar la fundación"
        }
      },
      // Opportunities
      opportunities: {
        title: "Oportunidades de voluntariado",
        subtitle: "Encuentra formas de contribuir a tu comunidad",
        loading: "Cargando oportunidades...",
        fetchError: "Error al cargar oportunidades",
        searchPlaceholder: "Buscar oportunidades...",
        showingResults: "Mostrando {{start}}-{{end}} de {{total}} oportunidades",
        noResults: "No se encontraron oportunidades",
        tryDifferentSearch: "Intenta con otros términos de búsqueda",
        active: "Activa",
        upcoming: "Próxima",
        ended: "Finalizada",
        apply: "Postularse",
        foundation: "Fundación",
        noDescription: "Sin descripción disponible"
      },
      // Opportunity Details
      opportunity: {
        manageParticipants: "Gestionar Participantes",
        notFound: "Oportunidad no encontrada",
        foundationsCannotApply: "Las fundaciones no pueden postularse a oportunidades",
        applicationError: "Error al enviar solicitud",
        applicationSuccess: "Solicitud enviada exitosamente",
        description: "Descripción",
        details: "Detalles",
        startDate: "Fecha de inicio",
        endDate: "Fecha de finalización",
        location: "Ubicación",
        contact: "Contacto",
        actions: "Acciones",
        apply: "Postularse",
        viewFoundation: "Ver fundación",
        supportFoundation: "Apoyar fundación",
        shareOpportunity: "Compartir oportunidad",
        aboutFoundation: "Sobre la fundación",
        applicationForm: "Formulario de solicitud",
        applicationMessage: "Mensaje de solicitud",
        applicationPlaceholder: "Cuéntanos por qué te interesa esta oportunidad...",
        applicationHint: "Opcional: comparte tu motivación y experiencia relevante",
        submitApplication: "Enviar solicitud",
        reviews: "reseñas",
        title: "Título",
        view: "Ver",
        edit: "Editar",
        foundationRequired: "Información de fundación requerida",
        createError: "Error al crear oportunidad",
        createSuccess: "Oportunidad creada exitosamente",
        create: "Crear oportunidad",
        createSubtitle: "Publica una nueva oportunidad de voluntariado",
        titlePlaceholder: "Ej: Limpieza de parque comunitario",
        descriptionPlaceholder: "Describe la actividad y lo que los voluntarios estarán haciendo...",
        startTime: "Hora de inicio",
        endTime: "Hora de finalización",
        locationPlaceholder: "Ej: Parque Central, Bogotá",
        requirements: "Requisitos",
        requirementsPlaceholder: "Ej: Mayor de edad, disponibilidad de medio día...",
        volunteersNeeded: "Voluntarios necesarios",
        volunteersNeededPlaceholder: "Ej: 20",
        contactInfo: "Información de contacto",
        contactInfoPlaceholder: "Ej: coordinador@fundacion.org"
      },
      // Create/Edit Opportunity
      createOpportunity: {
        title: "Crear nueva oportunidad",
        subtitle: "Crea una oportunidad de voluntariado para tu fundación",
        create: "Crear oportunidad",
        createSuccess: "Oportunidad creada exitosamente",
        createError: "Error al crear oportunidad",
        foundationRequired: "Se requiere configuración de fundación para crear oportunidades"
      },
      editOpportunity: {
        title: "Editar oportunidad",
        loading: "Cargando oportunidad...",
        saving: "Guardando...",
        save: "Guardar cambios",
        titlePlaceholder: "Título de la oportunidad",
        descriptionPlaceholder: "Describe la actividad...",
        locationPlaceholder: "Ubicación de la actividad",
        requiredSkills: "Habilidades requeridas",
        requiredSkillsPlaceholder: "Ej: Comunicación, trabajo en equipo",
        volunteersNeeded: "Voluntarios necesarios",
        contactEmail: "Email de contacto",
        image: "Imagen",
        errors: {
          fetchFailed: "Error al cargar la oportunidad",
          updateFailed: "Error al actualizar la oportunidad"
        }
      },
      // Participantes
      participants: {
        readOnlyView: "Vista de Solo Lectura",
        readOnlyMode: "Modo de Solo Lectura",
        title: "Gestionar Participantes",
        manage: "Gestionar participantes",
        pending: "Pendientes",
        accepted: "Aceptados",
        rejected: "Rechazados",
        total: "Total",
        noPending: "No hay solicitudes pendientes",
        noPendingDescription: "Aún no hay solicitudes para esta oportunidad",
        noAccepted: "No hay participantes aceptados",
        noAcceptedDescription: "Aún no has aceptado participantes",
        noRejected: "No hay solicitudes rechazadas",
        noRejectedDescription: "No has rechazado ninguna solicitud",
        appliedOn: "Aplicó el",
        message: "Mensaje",
        accept: "Aceptar",
        reject: "Rechazar",
        generateCertificate: "Generar certificado",
        statusChangeError: "Error al cambiar estado"
      },
      // Participations
      participations: {
        title: "Mis participaciones",
        subtitle: "Historial de solicitudes de voluntariado",
        fetchError: "Error al cargar participaciones",
        pending: "Pendiente",
        accepted: "Aceptado",
        rejected: "Rechazado",
        all: "Todas",
        total: "Total",
        noParticipations: "No tienes participaciones",
        noParticipationsDescription: "Aún no te has postulado a ninguna oportunidad",
        findOpportunities: "Buscar oportunidades",
        appliedOn: "Aplicaste el",
        acceptedOn: "Aceptado el",
        opportunity: "Oportunidad",
        noPending: "No tienes solicitudes pendientes",
        noAccepted: "No tienes participaciones aceptadas",
        appliedOnn: "Postulado el {{date}}",
        messageLabel: "Mensaje:",
        noPendingParticipations: "No hay participaciones pendientes",
        noAcceptedParticipations: "No accepted participations",
        acceptedOnn: "Aceptado el {{date}}"
      },
      // Donations
      donations: {
        title: "Mis donaciones",
        subtitle: "Historial de donaciones realizadas",
        fetchError: "Error al cargar donaciones",
        amount: "Monto",
        donor: "Donante",
        date: "Fecha",
        type: "Tipo",
        totalDonated: "Total donado",
        totalDonations: "Total de donaciones",
        monthlyDonations: "Donaciones mensuales",
        noDonations: "No tienes donaciones",
        noDonationsDescription: "Aún no has realizado ninguna donación",
        startDonating: "Comenzar a Donar",
        monthly: "Mensual",
        oneTime: "Una vez",
        anonymous: "Anónimo",
        dedication: "Dedicatoria",
        rateDonation: "Calificar donación",
        rateDescription: "Califica tu experiencia con {{foundation}}",
        yourRating: "Tu calificación",
        submitRating: "Enviar calificación",
        ratingSuccess: "Calificación enviada exitosamente",
        ratingError: "Error al enviar calificación",
        commentDonation: "Comentar donación",
        shareExperience: "Comparte tu experiencia",
        commentPlaceholder: "Escribe tu comentario sobre esta donación...",
        submitComment: "Enviar comentario",
        commentSuccess: "Comentario enviado exitosamente",
        commentError: "Error al enviar comentario",
        rate: "Calificar",
        comment: "Comentar",
        contributionHistory: "Historial de tus contribuciones",
        noDonationsMade: "Aún no has realizado donaciones",
        donationExperiencePlaceholder: "Cuéntanos sobre tu experiencia donando a esta fundación..."
      },
      // Donate
      donate: {
        title: "Realizar donación",
        selectAmount: "Selecciona el monto",
        customAmount: "Monto personalizado",
        customAmountPlaceholder: "Ingresa el monto",
        monthlyDonation: "Donación mensual",
        monthlyDescription: "Realiza una donación recurrente cada mes",
        donorName: "Nombre del donante",
        donorEmail: "Email del donante",
        dedication: "Dedicatoria (opcional)",
        dedicationPlaceholder: "En honor a...",
        paymentMethod: "Método de pago",
        selectPaymentMethod: "Selecciona método de pago",
        creditCard: "Tarjeta de crédito",
        debitCard: "Tarjeta débito",
        bankTransfer: "Transferencia bancaria",
        summary: "Resumen",
        amount: "Monto",
        frequency: "Frecuencia",
        monthly: "Mensual",
        beneficiary: "Beneficiario",
        submitDonation: "Donar {{amount}}",
        processing: "Procesando...",
        securityNote: "Tu información está protegida y segura",
        invalidAmount: "Monto inválido",
        processingError: "Error al procesar la donación",
        successMessage: "Donación de {{amount}} a {{foundation}} realizada exitosamente"
      },
      // Certificates
      certificates: {
        title: "Mis certificados",
        subtitle: "Tienes {{count}} certificados",
        fetchError: "Error al cargar certificados",
        downloadError: "Error al descargar certificado",
        noCertificates: "No tienes certificados",
        noCertificatesDescription: "Participa en oportunidades para obtener certificados",
        participateToEarn: "Participar en oportunidades",
        participationCertificate: "Certificado de participación",
        defaultDescription: "Este certificado reconoce la participación en actividades de voluntariado",
        issuedOn: "Emitido el",
        socialAction: "Acción social",
        download: "Descargar",
        generate: "Generar certificado",
        generateError: "Error al generar certificado",
        generateSuccess: "Certificado generado exitosamente",
        description: "Descripción",
        descriptionPlaceholder: "Descripción del certificado...",
        participant: "Participante",
        loginRequiredToViewCertificates: "Debes iniciar sesión para ver tus certificados"
      },
      // Favorites
      favorites: {
        title: "Mis favoritos",
        subtitle: "Tienes {{count}} elemento favorito",
        subtitle_plural: "Tienes {{count}} elementos favoritos",
        fetchError: "Error al cargar favoritos",
        all: "Todos",
        foundations: "Fundaciones",
        opportunities: "Oportunidades",
        noFavorites: "No tienes favoritos",
        noFavoritesDescription: "Agrega fundaciones y oportunidades a tus favoritos",
        exploreFoundations: "Explorar fundaciones",
        exploreOpportunities: "Explorar oportunidades",
        noFoundationFavorites: "No tienes fundaciones favoritas",
        noFoundationFavoritesDescription: "Explora y agrega fundaciones a tus favoritos",
        noOpportunityFavorites: "No tienes oportunidades favoritas",
        noOpportunityFavoritesDescription: "Explora y agrega oportunidades a tus favoritos",
        loginRequired: "Inicia sesión para agregar favoritos"
      },
      // Notifications
      notifications: {
        title: "Notificaciones",
        subtitle: "{{total}} notificaciones ({{unread}} sin leer)",
        fetchError: "Error al cargar notificaciones",
        markAllAsRead: "Marcar todas como leídas",
        markAsRead: "Marcar como leída",
        noNotifications: "No tienes notificaciones",
        noNotificationsDescription: "Te notificaremos sobre actividades importantes",
        new: "Nueva"
      },
      // Comments
      comments: {
        title: "Comentarios y calificaciones",
        loginRequired: "Inicia sesión para comentar",
        rating: "Calificación",
        writeComment: "Escribe un comentario",
        placeholder: "Comparte tu experiencia...",
        submit: "Enviar comentario",
        submitError: "Error al enviar comentario",
        noComments: "No hay comentarios aún"
      },
      // Profile
      profile: {
        userNotFound: "Usuario no encontrado",
        updateError: "Error al actualizar perfil",
        memberSince: "Miembro desde",
        editProfile: "Editar perfil",
        donations: "Donaciones",
        participations: "Participaciones",
        certificates: "Certificados",
        noDonations: "No tienes donaciones",
        startDonating: "Comienza a donar para apoyar causas",
        findFoundations: "Encontrar fundaciones",
        noParticipations: "No tienes participaciones",
        startVolunteering: "Comienza a hacer voluntariado",
        findOpportunities: "Encontrar oportunidades",
        noCertificates: "No tienes certificados",
        earnCertificates: "Participa en oportunidades para obtener certificados",
        publicProfile: "Perfil público",
        limitedInfo: "La información pública es limitada",
        opportunity: "Oportunidad",
        appliedOn: "Aplicaste el",
        activeActivities: "Actividades Activas",
        noActiveActivities: "Sin actividades activas",
        noCurrentParticipation: "no está participando en ninguna actividad en este momento.",
        profileInfo: "Información del Perfil",
        publicInfoDescription: "Esta es la información pública disponible de "
      },
      // Search
      search: {
        title: "Buscar",
        subtitle: "Encuentra fundaciones y oportunidades",
        placeholder: "Buscar fundaciones y oportunidades...",
        searching: "Buscando...",
        resultsFor: "Resultados para",
        noResults: "No se encontraron resultados",
        noResultsMessage: "Intenta con otros términos de búsqueda",
        clearSearch: "Limpiar búsqueda",
        tabs: {
          all: "Todos",
          foundations: "Fundaciones",
          opportunities: "Oportunidades"
        },
        tips: {
          title: "Consejos de búsqueda",
          subtitle: "Encuentra exactamente lo que buscas",
          foundations: "Fundaciones",
          foundationsDescription: "Busca por nombre, ubicación o causa",
          opportunities: "Oportunidades",
          opportunitiesDescription: "Busca por actividad, fecha o ubicación",
          location: "Ubicación",
          locationDescription: "Filtra por ciudad o región específica"
        }
      },
      // Filters
      filters: {
        title: "Filtros",
        status: "Estado",
        allStatuses: "Todos los estados",
        location: "Ubicación",
        locationPlaceholder: "Filtrar por ubicación",
        startDate: "Fecha de inicio",
        endDate: "Fecha de finalización",
        clear: "Limpiar filtros"
      },
      // File Upload
      fileUpload: {
        selectFile: "Seleccionar archivo",
        maxSize: "Tamaño máximo",
        sizeTooLarge: "El archivo es demasiado grande"
      },
      // Create Suggestion
      createSuggestion: {
        title: "Enviar sugerencia",
        subtitle: "Ayúdanos a mejorar la plataforma",
        category: "Categoría",
        selectCategory: "Selecciona una categoría",
        categories: {
          platform: "Plataforma",
          foundations: "Fundaciones",
          opportunities: "Oportunidades",
          donations: "Donaciones",
          certificates: "Certificados",
          other: "Otro"
        },
        categoryHelp: "Selecciona la categoría que mejor describa tu sugerencia",
        content: "Sugerencia",
        contentPlaceholder: "Describe tu sugerencia en detalle...",
        characters: "caracteres",
        anonymous: "Enviar como anónimo",
        anonymousHelp: "Tu nombre no aparecerá asociado a esta sugerencia",
        guidelines: {
          title: "Pautas para sugerencias",
          specific: "Sé específico y detallado",
          constructive: "Mantén un tono constructivo",
          respectful: "Sé respetuoso con la comunidad",
          implementable: "Propón ideas implementables"
        },
        submit: "Enviar sugerencia",
        submitting: "Enviando...",
        success: {
          title: "Sugerencia enviada exitosamente",
          message: "Gracias por ayudarnos a mejorar. Revisaremos tu sugerencia pronto."
        },
        errors: {
          loginRequired: "Debes iniciar sesión para enviar sugerencias",
          submitFailed: "Error al enviar la sugerencia"
        },
        info: {
          improve: {
            title: "Ayuda a mejorar",
            description: "Tus ideas nos ayudan a crear una mejor experiencia para todos"
          },
          community: {
            title: "Construye comunidad",
            description: "Juntos podemos hacer de esta plataforma un lugar mejor"
          },
          impact: {
            title: "Genera impacto",
            description: "Tu participación hace la diferencia en nuestra misión"
          }
        }
      },
      // Suggestions Received
      suggestionsReceived: {
        title: "Sugerencias recibidas",
        subtitle: "Gestiona las sugerencias de la comunidad",
        loading: "Cargando sugerencias...",
        filters: {
          all: "Todas las sugerencias",
          unprocessed: "Sin procesar",
          processed: "Procesadas"
        },
        stats: {
          total: "Total de sugerencias",
          pending: "Sin procesar",
          processed: "Procesadas"
        },
        noSuggestions: "No hay sugerencias",
        noSuggestionsMessage: "Aún no has recibido sugerencias de la comunidad",
        processed: "Procesada",
        pending: "Pendiente",
        markAsProcessed: "Marcar como procesada",
        markAsProcessedMessage: "¿Estás seguro que quieres marcar esta sugerencia como procesada?",
        suggestion: "Sugerencia",
        response: "Respuesta",
        responsePlaceholder: "Escribe una respuesta opcional...",
        confirm: "Confirmar",
        confirmDelete: "¿Estás seguro que quieres eliminar esta sugerencia?",
        errors: {
          fetchFailed: "Error al cargar sugerencias",
          markFailed: "Error al marcar como procesada",
          deleteFailed: "Error al eliminar sugerencia"
        }
      },
      // Reports
      reports: {
        title: "Reportes y análisis",
        subtitle: "Estadísticas y métricas de tu fundación",
        loading: "Cargando reportes...",
        refresh: "Actualizar",
        totalDonations: "Total de donaciones",
        totalOpportunities: "Total de oportunidades",
        totalParticipants: "Total de participantes",
        certificatesIssued: "Certificados emitidos",
        tabs: {
          donations: "Donaciones",
          participation: "Participación"
        },
        donationsByCategory: "Donaciones por categoría",
        donationsByDay: "Donaciones por día",
        participantsByOpportunity: "Participantes por oportunidad",
        monthlyGrowth: "Crecimiento mensual",
        totalApplications: "Total de solicitudes",
        acceptedApplications: "Solicitudes aceptadas",
        donationAmount: "Monto de donaciones",
        donationCount: "Cantidad de donaciones"
      },
      // Not Found
      notFound: {
        title: "Página no encontrada",
        message: "Lo sentimos, la página que buscas no existe",
        goHome: "Ir al inicio",
        goBack: "Volver atrás",
        helpfulLinks: "Enlaces útiles",
        links: {
          foundations: "Fundaciones",
          foundationsDescription: "Explora organizaciones benéficas",
          opportunities: "Oportunidades",
          opportunitiesDescription: "Encuentra formas de ayudar",
          about: "Acerca de",
          aboutDescription: "Conoce más sobre nosotros",
          search: "Buscar",
          searchDescription: "Encuentra lo que buscas"
        }
      },
      // Footer
      footer: {
        description: "Plataforma que conecta personas generosas con causas que importan.",
        explore: "Explorar",
        foundations: "Fundaciones",
        opportunities: "Oportunidades",
        search: "Buscar",
        company: "Empresa",
        about: "Acerca de",
        contact: "Contacto",
        careers: "Carreras",
        support: "Soporte",
        help: "Ayuda",
        privacy: "Privacidad",
        terms: "Términos",
        community: "Comunidad",
        suggestions: "Sugerencias",
        blog: "Blog",
        newsletter: "Newsletter",
        allRights: "Todos los derechos reservados.",
        madeWith: "Hecho ",
        inColombia: "en Colombia"
      },
      // Categories
      social: {
        title: "Área Social",
        description: "Iniciativas para el desarrollo social y comunitario",
        communitySupport: "Apoyo comunitario",
        socialInclusion: "Inclusión social",
        povertyReduction: "Reducción de la pobreza",
        humanRights: "Derechos humanos",
        genderEquality: "Igualdad de género",
        childProtection: "Protección infantil",
        elderlycare: "Cuidado de adultos mayores",
        disabilitySupport: "Apoyo a personas con discapacidad",
        refugeeAssistance: "Asistencia a refugiados",
        homelessness: "Apoyo a personas sin hogar",
        socialJustice: "Justicia social",
        communityDevelopment: "Desarrollo comunitario"
      },
      events: {
        title: "Eventos",
        description: "Actividades y eventos sociales",
        fundraising: "Recaudación de fondos",
        volunteering: "Voluntariado",
        awareness: "Concientización",
        community: "Comunidad",
        charity: "Caridad",
        workshop: "Taller",
        seminar: "Seminario",
        conference: "Conferencia",
        festival: "Festival",
        marathon: "Maratón",
        auction: "Subasta benéfica",
        gala: "Gala benéfica",
        cleanup: "Jornada de limpieza",
        bloodDrive: "Donación de sangre"
      },
      environmental: {
        title: "Medio Ambiente",
        description: "Conservación y protección ambiental",
        climateChange: "Cambio climático",
        conservation: "Conservación",
        sustainability: "Sostenibilidad",
        recycling: "Reciclaje",
        reforestation: "Reforestación",
        pollution: "Contaminación",
        biodiversity: "Biodiversidad",
        renewableEnergy: "Energía renovable",
        waterProtection: "Protección del agua",
        wildlife: "Vida silvestre",
        greenSpaces: "Espacios verdes",
        ecoEducation: "Educación ambiental",
        carbonFootprint: "Huella de carbono",
        organicFarming: "Agricultura orgánica"
      },
      education: {
        title: "Educación",
        description: "Oportunidades educativas y desarrollo académico",
        literacy: "Alfabetización",
        scholarship: "Becas",
        tutoring: "Tutoría",
        mentorship: "Mentoría",
        digitalLiteracy: "Alfabetización digital",
        vocationalTraining: "Formación profesional",
        earlyChildhood: "Primera infancia",
        adultEducation: "Educación para adultos",
        specialNeeds: "Necesidades especiales",
        stemEducation: "Educación STEM",
        artEducation: "Educación artística",
        languageLearning: "Aprendizaje de idiomas",
        lifeSkills: "Habilidades para la vida",
        financialLiteracy: "Educación financiera"
      },
      health: {
        title: "Salud",
        description: "Bienestar y cuidado de la salud",
        mentalHealth: "Salud mental",
        physicalHealth: "Salud física",
        prevention: "Prevención",
        nutrition: "Nutrición",
        healthcare: "Atención médica",
        vaccination: "Vacunación",
        maternalHealth: "Salud materna",
        childHealth: "Salud infantil",
        addiction: "Adicciones",
        chronicDiseases: "Enfermedades crónicas",
        rehabilitation: "Rehabilitación",
        emergencycare: "Atención de emergencia",
        publicHealth: "Salud pública",
        healthEducation: "Educación en salud"
      },
      arts: {
        title: "Artes y Cultura",
        description: "Promoción de expresiones artísticas y culturales",
        visualArts: "Artes visuales",
        performingArts: "Artes escénicas",
        music: "Música",
        theater: "Teatro",
        dance: "Danza",
        literature: "Literatura",
        film: "Cine",
        photography: "Fotografía",
        sculpture: "Escultura",
        painting: "Pintura",
        crafts: "Artesanías",
        culturalHeritage: "Patrimonio cultural",
        artTherapy: "Arte terapia",
        publicArt: "Arte público"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;