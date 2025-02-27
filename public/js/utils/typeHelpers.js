// public/js/utils/typeHelpers.js
import state from '../core/state.js';
import { pronounMapping } from '../core/state.js';
import { allPlaceholders } from '../core/placeholders.js';
import { Utils } from './utils.js';
import { StringUtils } from './StringUtils.js';

export const TypeHelpers = {
    // Helper functions for naturalizeType
    _extractSubtype: (type, prefixLength) => {
        return StringUtils.extractSubtype(type, prefixLength);
    },
    
    _formatNounType: (sub, nounType, isPlural, isProper) => {
        if (sub.toLowerCase() === "person") {
            return `Person (${isProper ? 'proper' : 'common'}, ${isPlural ? 'plural' : 'singular'})`;
        }
        const displayText = StringUtils.toTitleCase(StringUtils.naturalDisplay(sub || (isProper ? "Proper Noun" : "Common Noun")));
        return `${displayText} (${isPlural ? 'Plural' : 'Singular'})`;
    },
    
    naturalizeType: (type) => {
        // Handle noun patterns (NNP/NNPS/NN/NNS)
        if (type.startsWith("NNP") || type.startsWith("NN")) {
            const isProper = type.startsWith("NNP");
            const isPlural = type.startsWith("NNS") || type.startsWith("NNPS");
            const prefixLength = isProper ? (isPlural ? 4 : 3) : (isPlural ? 3 : 2);
            const sub = TypeHelpers._extractSubtype(type, prefixLength);
            return TypeHelpers._formatNounType(sub, type, isPlural, isProper);
        }
        
        if (type === "Onomatopoeia") return "Onomatopoeia";
        
        // Handle modal verbs
        if (type.startsWith("MD_")) {
            let tense = type.substring(3);
            let tenseNatural = "";
            switch (tense) {
                case "VB": tenseNatural = "Base (run)"; break;
                case "VBP": tenseNatural = "Present (I walk)"; break;
                case "VBZ": tenseNatural = "3rd Person (he leaves)"; break;
                case "VBD": tenseNatural = "Past (slept)"; break;
                case "VBG": tenseNatural = "Gerund (crying)"; break;
                case "VBN": tenseNatural = "Past Participle (eaten)"; break;
                default: tenseNatural = tense;
            }
            return "Modal Verb (" + tenseNatural + ")";
        }
        
        // Handle verb tenses
        const verbTenseMap = {
            "VBZ": "3rd Person (he leaves)",
            "VBD": "Past Tense (slept)",
            "VBG": "Gerund (crying)",
            "VBN": "Past Participle (eaten)",
            "VBP": "Present (I walk)"
        };
        
        for (let tense in verbTenseMap) {
            if (type.startsWith(tense)) {
                let remainder = type.substring(tense.length);
                let category = remainder.startsWith("_") ? remainder.substring(1) : "";
                return category
                    ? StringUtils.toTitleCase(category) + " Verb (" + verbTenseMap[tense] + ")"
                    : "Verb (" + verbTenseMap[tense] + ")";
            }
        }
        
        // Handle base verb form
        if (type.startsWith("VB")) {
            let rest = type.substring(2).replace(/^_+/, "");
            return rest ? StringUtils.toTitleCase(rest) + " Verb (Base Form)" : "Verb (Base Form)";
        }
        
        // Handle adjectives and other types
        if (type.startsWith("JJ_")) {
            return StringUtils.toTitleCase(StringUtils.naturalDisplay(type.substring(3)));
        }
        
        if (type.startsWith("JJS_")) {
            let sub = type.substring(4);
            if (sub.toLowerCase() === "ordinal") {
                return "Ordinal Number";
            }
            return StringUtils.toTitleCase(StringUtils.naturalDisplay(sub)) + " Superlative Adjective";
        }
        
        // Handle standard part-of-speech abbreviations
        const posMap = {
            "JJ": "Adjective",
            "JJR": "Comparative Adjective",
            "JJS": "Superlative Adjective",
            "RB": "Adverb",
            "RBR": "Comparative Adverb",
            "RBS": "Superlative Adverb",
            "WRB": "WH-adverb",
            "CC": "Coordinating Conjunction",
            "PDT": "Pre-determiner",
            "WDT": "WH-determiner",
            "FW": "Foreign Word",
            "Number": "Number",
            "Exclamation": "Exclamation"
        };
        
        return posMap[type] || type;
    },
    getTooltipForType: (type) => {
        const normalizedType = type.trim().toLowerCase();
        for (let category in allPlaceholders) {
            for (let p of allPlaceholders[category]) {
                if (p.internalType.trim().toLowerCase() === normalizedType) {
                    return p.tooltip;
                }
            }
        }
        const verbTensePrefixes = ["VBZ", "VBD", "VBG", "VBN", "VBP"];
        for (let prefix of verbTensePrefixes) {
            if (normalizedType.startsWith(prefix.toLowerCase() + "_")) {
                const baseType = "vb_" + normalizedType.substring(prefix.length + 1);
                for (let category in allPlaceholders) {
                    for (let p of allPlaceholders[category]) {
                        if (p.internalType.trim().toLowerCase() === baseType) {
                            return p.tooltip;
                        }
                    }
                }
            }
        }
        return "No additional info available.";
    },
    getOriginalDisplayForType: (type) => {
        for (let category in allPlaceholders) {
            for (let p of allPlaceholders[category]) {
                if (p.internalType === type) {
                    return p.display;
                }
            }
        }
        return type.startsWith("NN") ? TypeHelpers.naturalizeType(type) : type;
    },
    guessTypeFromId: (id) => {
        let base = id.replace(/\d+$/, '');
        const custom = state.customPlaceholders.find(p => p.type === base);
        if (custom) return custom.type;
        const pronounFixedRe = /^PRP(\d+)(SUB|OBJ|PSA|PSP|REF)$/;
        if (pronounFixedRe.test(id)) {
            const match = id.match(pronounFixedRe);
            const groupNum = match[1];
            const abbrev = match[2];
            const formMapReverse = { SUB: "subject", OBJ: "object", PSA: "possAdj", PSP: "possPron", REF: "reflexive" };
            return `PRONOUN|PronounGroup${groupNum}|${formMapReverse[abbrev]}`;
        }
        const pronounRe = /^([A-Za-z0-9]+)_(subject|object|possAdj|possPron|reflexive)$/;
        if (pronounRe.test(base)) {
            const m = base.match(pronounRe);
            return `PRONOUN|${m[1]}|${m[2]}`;
        }
        return TypeHelpers.naturalizeType(base);
    },
    getNounFinalType: (baseInternal, number) => {
        let baseTag = "", extra = "";
        if (baseInternal.indexOf("_") !== -1) {
            const parts = baseInternal.split("_");
            baseTag = parts[0];
            extra = parts.slice(1).join("_");
        } else {
            baseTag = baseInternal;
        }
        let finalTag = baseTag === "NN" ? (number === "Singular" ? "NN" : "NNS")
            : baseTag === "NNP" ? (number === "Singular" ? "NNP" : "NNPS")
                : (number === "Singular" ? baseTag : baseTag + "S");
        return extra ? finalTag + "_" + extra : finalTag;
    },
    computeFinalVerbType: (baseInternal, tenseTag) => {
        if (baseInternal === "MD") return "MD_" + tenseTag;
        const parts = baseInternal.split("_");
        const baseCategory = parts.slice(1).join("_");
        return baseCategory ? tenseTag + "_" + baseCategory : tenseTag;
    }
};