/**
 * Order of categories as they appear in the placeholder accordion
 */
export const categoryOrder = ["Nouns", "Verbs", "Descriptors", "Other"];

/**
 * Complete collection of all predefined placeholders by category
 */
export const allPlaceholders = {
    "Nouns": [
        { internalType: "NN", display: "Noun", tooltip: "Generic noun (table, apple)", icon: "fas fa-book", isPrimary: true },
        { internalType: "NNP", display: "Proper Noun", tooltip: "Specific name (London, Sarah)", icon: "fas fa-user", isPrimary: false },
        { internalType: "PRONOUN", display: "Pronoun", tooltip: "A pronoun", icon: "fas fa-user-circle", isPrimary: true },
        { internalType: "NN_Concrete", display: "Concrete", tooltip: "Tangible object (chair, phone)", icon: "fas fa-cube", isPrimary: false },
        { internalType: "NN_Person", display: "Person", tooltip: "A person (teacher, doctor)", icon: "fas fa-user-friends", isPrimary: true },
        { internalType: "NN_Place", display: "Place", tooltip: "A location (park, school)", icon: "fas fa-map-marker-alt", isPrimary: true },
        { internalType: "NN_Abstract", display: "Abstract", tooltip: "Intangible (happiness, freedom)", icon: "fas fa-cloud", isPrimary: true },
        { internalType: "NN_Animal", display: "Animal", tooltip: "Living creature (dog, elephant)", icon: "fas fa-dog", isPrimary: false },
        { internalType: "NN_BodyPart", display: "Body Part", tooltip: "Part of body (hand, knee)", icon: "fas fa-hand-paper", isPrimary: false },
        { internalType: "NN_Clothing", display: "Clothing", tooltip: "Wearable (shirt, jacket)", icon: "fas fa-tshirt", isPrimary: false },
        { internalType: "NN_Drink", display: "Drink", tooltip: "Beverage (juice, coffee)", icon: "fas fa-cocktail", isPrimary: false },
        { internalType: "NN_Emotion", display: "Emotion", tooltip: "Feeling (joy, anger)", icon: "fas fa-heart", isPrimary: false },
        { internalType: "NN_Food", display: "Food", tooltip: "Edible item (pizza, carrot)", icon: "fas fa-utensils", isPrimary: false },
        { internalType: "NN_Vehicle", display: "Vehicle", tooltip: "Mode of transport (car, bicycle)", icon: "fas fa-car", isPrimary: false },
        { internalType: "NN_Onomatopoeia", display: "Sound/Onomatopoeia", tooltip: "Sound word (bang, buzz)", icon: "fas fa-volume-up", isPrimary: false }
    ],
    "Verbs": [
        { internalType: "VB", display: "Verb", tooltip: "Action/state (jump, write)", icon: "fas fa-pen", isPrimary: true },
        { internalType: "VB_Intransitive", display: "Intransitive", tooltip: "No object (sleep, arrive)", icon: "fas fa-bed", isPrimary: true },
        { internalType: "VB_Transitive", display: "Transitive", tooltip: "Takes object (kick, carry)", icon: "fas fa-hammer", isPrimary: true },
        { internalType: "VB_Action", display: "Action", tooltip: "Physical action (run, climb)", icon: "fas fa-bolt", isPrimary: false },
        { internalType: "VB_Stative", display: "State", tooltip: "Condition (believe, know)", icon: "fas fa-brain", isPrimary: false },
        { internalType: "VB_Communication", display: "Communication", tooltip: "Speaking (say, shout)", icon: "fas fa-comment-dots", isPrimary: false },
        { internalType: "VB_Movement", display: "Movement", tooltip: "Motion-based (walk, swim)", icon: "fas fa-walking", isPrimary: false },
        { internalType: "VB_Onomatopoeia", display: "Sound/Onomatopoeia", tooltip: "Sound verb (meow, boom)", icon: "fas fa-volume-up", isPrimary: false },
        { internalType: "MD", display: "Modal", tooltip: "Possibility (can, must)", icon: "fas fa-key", isPrimary: false },
        { internalType: "VB_Linking", display: "Linking", tooltip: "Links subject (seem, become)", icon: "fas fa-link", isPrimary: false },
        { internalType: "VB_Phrase", display: "Phrasal Verb", tooltip: "Multi-word verb (give up, look after)", icon: "fas fa-random", isPrimary: false }
    ],
    "Descriptors": [
        { internalType: "JJ", display: "Adjective", tooltip: "Describes noun (blue, tall)", icon: "fas fa-ad", isPrimary: true },
        { internalType: "RB", display: "Adverb", tooltip: "Modifies verb (quickly, often)", icon: "fas fa-feather-alt", isPrimary: true },
        { internalType: "JJR", display: "Comparative", tooltip: "Comparison (faster, smaller)", icon: "fas fa-level-up-alt", isPrimary: false },
        { internalType: "JJS", display: "Superlative", tooltip: "Highest degree (best, tallest)", icon: "fas fa-medal", isPrimary: false },
        { internalType: "JJ_Number", display: "Ordered Number", tooltip: "A ranked number (1st, seventh)", icon: "fas fa-hashtag", isPrimary: true }
    ],
    "Other": [
        { internalType: "IN", display: "Preposition", tooltip: "Shows relation (in, under)", icon: "fas fa-arrows-alt", isPrimary: false },
        { internalType: "DT", display: "Determiner", tooltip: "Specifier (a, the)", icon: "fas fa-bookmark", isPrimary: false },
        { internalType: "CC", display: "Conjunction", tooltip: "Joins clauses (and, or)", icon: "fas fa-link", isPrimary: false },
        { internalType: "FW", display: "Foreign Word", tooltip: "Non-English (bonjour, sushi)", icon: "fas fa-globe", isPrimary: false },
        { internalType: "Number", display: "Number", tooltip: "Numerical (five, twenty)", icon: "fas fa-hashtag", isPrimary: true },
        { internalType: "Exclamation", display: "Exclamation", tooltip: "Interjection (wow, oops)", icon: "fas fa-bullhorn", isPrimary: true }
    ]
};

/**
 * Available verb tenses for selection
 */
export const VERB_TENSES = [
    { value: 'VB', text: 'Base (run)' },
    { value: 'VBP', text: 'Present (I walk)' },
    { value: 'VBZ', text: 'Present 3rd (he leaves)' },
    { value: 'VBD', text: 'Past (slept)' },
    { value: 'VBG', text: 'Gerund (crying)' },
    { value: 'VBN', text: 'Past Participle (eaten)' }
]; 