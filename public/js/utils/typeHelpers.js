// public/js/utils/typeHelpers.js
import state from '../core/state.js';
import { pronounMapping } from '../core/state.js';
import { allPlaceholders } from '../core/placeholders.js';
import { Utils } from './utils.js';

export const TypeHelpers = {
    naturalizeType: (type) => {
        if (type.startsWith("NNPS")) {
            let sub = type.substring(4);
            if (sub.startsWith("_")) sub = sub.substring(1);
            sub = sub.replace(/\d+$/, '');
            if (sub.toLowerCase() === "person") {
                return "Person (proper, plural)";
            }
            return Utils.toTitleCase(Utils.naturalDisplay(sub || "Proper Noun")) + " (Plural)";
        }
        if (type.startsWith("NNP")) {
            let sub = type.substring(3);
            if (sub.startsWith("_")) sub = sub.substring(1);
            sub = sub.replace(/\d+$/, '');
            if (sub.toLowerCase() === "person") {
                return "Person (proper, singular)";
            }
            return Utils.toTitleCase(Utils.naturalDisplay(sub || "Proper Noun")) + " (Singular)";
        }
        if (type.startsWith("NNS")) {
            let sub = type.substring(3);
            if (sub.startsWith("_")) sub = sub.substring(1);
            sub = sub.replace(/\d+$/, '');
            if (sub.toLowerCase() === "person") {
                return "Person (common, plural)";
            }
            return Utils.toTitleCase(Utils.naturalDisplay(sub || "Common Noun")) + " (Plural)";
        }
        if (type.startsWith("NN")) {
            let sub = type.substring(2);
            if (sub.startsWith("_")) sub = sub.substring(1);
            sub = sub.replace(/\d+$/, '');
            if (sub.toLowerCase() === "person") {
                return "Person (common, singular)";
            }
            return Utils.toTitleCase(Utils.naturalDisplay(sub || "Common Noun")) + " (Singular)";
        }
        if (type.startsWith("NNS")) {
            let sub = type.substring(3);
            if (sub.startsWith("_")) sub = sub.substring(1);
            sub = sub.replace(/\d+$/, '');
            return Utils.toTitleCase(Utils.naturalDisplay(sub || "Common Noun")) + " (Plural)";
        }
        if (type.startsWith("NN")) {
            let sub = type.substring(2);
            if (sub.startsWith("_")) sub = sub.substring(1);
            sub = sub.replace(/\d+$/, '');
            return Utils.toTitleCase(Utils.naturalDisplay(sub || "Common Noun")) + " (Singular)";
        }
        if (type === "Onomatopoeia") return "Onomatopoeia";
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
                let category = "";
                if (remainder.startsWith("_")) {
                    category = remainder.substring(1);
                }
                return category
                    ? Utils.toTitleCase(category) + " Verb (" + verbTenseMap[tense] + ")"
                    : "Verb (" + verbTenseMap[tense] + ")";
            }
        }
        if (type.startsWith("VB")) {
            let rest = type.substring(2).replace(/^_+/, "");
            return rest ? Utils.toTitleCase(rest) + " Verb (Base Form)" : "Verb (Base Form)";
        }
        if (type.startsWith("JJ_")) {
            let sub = type.substring(3);
            return Utils.toTitleCase(Utils.naturalDisplay(sub));
        }
        if (type.startsWith("JJS_")) {
            let sub = type.substring(4);
            if (sub.toLowerCase() === "ordinal") {
                return "Ordinal Number";
            }
            return Utils.toTitleCase(Utils.naturalDisplay(sub)) + " Superlative Adjective";
        }
        if (type === "JJ") return "Adjective";
        if (type === "JJR") return "Comparative Adjective";
        if (type === "JJS") return "Superlative Adjective";
        if (type === "RB") return "Adverb";
        if (type === "RBR") return "Comparative Adverb";
        if (type === "RBS") return "Superlative Adverb";
        if (type === "WRB") return "WH-adverb";
        if (type === "CC") return "Coordinating Conjunction";
        if (type === "PDT") return "Pre-determiner";
        if (type === "WDT") return "WH-determiner";
        if (type === "FW") return "Foreign Word";
        if (type === "Number") return "Number";
        if (type === "Exclamation") return "Exclamation";
        return type;
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