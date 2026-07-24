from typing import Dict, Any

TREATMENT_DATABASE: Dict[str, Dict[str, Any]] = {
    "Healthy Leaf": {
        "disease": "Healthy Leaf",
        "severity": "low",
        "treatment": "Crop exhibits optimum cellular vitality and balanced chlorophyll.",
        "fungicide": "No chemical fungicide required.",
        "organicAlternative": "Apply Vermicompost tea + Neem cake soil application for preventative immunity.",
        "prevention": "Maintain standard soil moisture telemetry and weekly leaf inspection routine."
    },
    "Tomato Early Blight (Alternaria solani)": {
        "disease": "Tomato Early Blight",
        "severity": "high",
        "treatment": "Apply Chlorothalonil 75% WP @ 2g/L or Difenoconazole 25% EC @ 0.5ml/L at first sign of target spots.",
        "fungicide": "Chlorothalonil 75% WP / Difenoconazole 25% EC",
        "organicAlternative": "Spray fermented garlic-chilli extract + Panchagavya 3% solution weekly.",
        "prevention": "Remove lower infected foliage, mulch around plant base, and maintain optimal drip irrigation."
    },
    "Tomato Late Blight (Phytophthora infestans)": {
        "disease": "Tomato Late Blight",
        "severity": "high",
        "treatment": "Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L or Cymoxanil @ 2g/L immediately upon detection.",
        "fungicide": "Metalaxyl 8% + Mancozeb 64% WP",
        "organicAlternative": "Apply Copper hydroxide @ 2g/L + Trichoderma viride bio-fungicide (5g/L).",
        "prevention": "Ensure high field drainage, avoid overhead sprinkler irrigation, and clear crop residue post-harvest."
    },
    "Tomato Leaf Mold (Passalora fulva)": {
        "disease": "Tomato Leaf Mold",
        "severity": "moderate",
        "treatment": "Spray Copper Oxychloride 50% WP @ 3g/L or Difenoconazole @ 0.5ml/L.",
        "fungicide": "Copper Oxychloride 50% WP",
        "organicAlternative": "Spray 10% Cow urine extract + Neem seed kernel extract (5ml/L).",
        "prevention": "Improve greenhouse ventilation and lower relative humidity below 85%."
    },
    "Tomato Septoria Leaf Spot": {
        "disease": "Tomato Septoria Leaf Spot",
        "severity": "moderate",
        "treatment": "Apply Mancozeb 75% WP @ 2g/L or Azoxystrobin @ 1ml/L at 7-10 day intervals.",
        "fungicide": "Mancozeb 75% WP / Azoxystrobin",
        "organicAlternative": "Bio-fungicide Bacillus subtilis @ 5g/L + Neem oil 10,000 ppm @ 3ml/L.",
        "prevention": "Practice 3-year crop rotation with non-solanaceous crops and control weed hosts."
    },
    "Tomato Bacterial Spot (Xanthomonas)": {
        "disease": "Tomato Bacterial Spot",
        "severity": "high",
        "treatment": "Spray Streptocycline @ 0.2g/L mixed with Copper Oxychloride @ 2g/L.",
        "fungicide": "Copper Oxychloride 50% WP + Streptocycline",
        "organicAlternative": "Apply Pseudomonas fluorescens bio-agent @ 10g/L spray.",
        "prevention": "Use certified disease-free seeds and sanitize tools before entering fields."
    },
    "Tomato Mosaic Virus": {
        "disease": "Tomato Mosaic Virus",
        "severity": "high",
        "treatment": "Control vector population (aphids/whiteflies) using Imidacloprid 17.8% SL @ 0.5ml/L.",
        "fungicide": "Systemic Vector Insecticide (Imidacloprid / Thiamethoxam)",
        "organicAlternative": "Install Yellow Sticky Traps + Spray Neem Oil 10,000 ppm @ 3ml/L.",
        "prevention": "Uproot and burn infected plants immediately to prevent mechanical transmission."
    },
    "Potato Early Blight (Alternaria solani)": {
        "disease": "Potato Early Blight",
        "severity": "high",
        "treatment": "Apply Chlorothalonil 75% WP @ 2g/L or Mancozeb 75% WP @ 2.5g/L.",
        "fungicide": "Chlorothalonil 75% WP",
        "organicAlternative": "Spray Trichoderma viride (5g/L) + Copper sulfate solution.",
        "prevention": "Maintain recommended tuber planting depth and balanced potassium fertilization."
    },
    "Potato Late Blight (Phytophthora infestans)": {
        "disease": "Potato Late Blight",
        "severity": "high",
        "treatment": "Spray Dimethomorph 50% WP @ 1g/L or Fenamidone + Mancozeb @ 2g/L.",
        "fungicide": "Dimethomorph 50% WP / Cymoxanil",
        "organicAlternative": "Apply Bordeaux mixture 1% spray preventatively.",
        "prevention": "Destroy cull piles and practice proper tuber hilling to protect tubers."
    },
    "Wheat Yellow Stripe Rust (Puccinia striiformis)": {
        "disease": "Wheat Yellow Stripe Rust",
        "severity": "high",
        "treatment": "Apply Propiconazole 25% EC @ 1ml/L immediately at early stripe detection.",
        "fungicide": "Propiconazole 25% EC / Triadimefon 25% WP",
        "organicAlternative": "Spray fermented garlic-chilli extract + Panchagavya 3% solution weekly.",
        "prevention": "Sow rust-resistant crop varieties and eliminate wild grass alternate hosts around farm perimeters."
    },
    "Wheat Brown Leaf Rust (Puccinia recondita)": {
        "disease": "Wheat Brown Leaf Rust",
        "severity": "high",
        "treatment": "Apply Tebuconazole 25.9% EC @ 1ml/L or Propiconazole 25% EC @ 1ml/L.",
        "fungicide": "Tebuconazole 25.9% EC",
        "organicAlternative": "Apply Neem cake extract + Bio-fungicide Trichoderma viride.",
        "prevention": "Avoid late sowing and choose rust-tolerant wheat cultivars."
    },
    "Wheat Powdery Mildew (Erysiphe graminis)": {
        "disease": "Wheat Powdery Mildew",
        "severity": "moderate",
        "treatment": "Spray Wettable Sulphur 80% WP @ 3g/L or Hexaconazole 5% EC @ 1ml/L.",
        "fungicide": "Wettable Sulphur 80% WP / Hexaconazole 5% EC",
        "organicAlternative": "Apply baking soda solution (5g/L) mixed with liquid horticultural oil.",
        "prevention": "Maintain optimal seeding rate to prevent overly dense plant canopy."
    },
    "Wheat Leaf Blight (Bipolaris sorokiniana)": {
        "disease": "Wheat Leaf Blight",
        "severity": "moderate",
        "treatment": "Spray Mancozeb 75% WP @ 2.5g/L or Azoxystrobin @ 1ml/L.",
        "fungicide": "Mancozeb 75% WP",
        "organicAlternative": "Apply Bio-fungicide Pseudomonas fluorescens @ 10g/L.",
        "prevention": "Treat seed tubers with seed dressing fungicides prior to sowing."
    },
    "Rice Bacterial Leaf Blight (Xanthomonas oryzae)": {
        "disease": "Rice Bacterial Leaf Blight",
        "severity": "high",
        "treatment": "Spray Streptocycline @ 0.2g/L + Copper Oxychloride @ 2.0g/L.",
        "fungicide": "Copper Oxychloride + Streptocycline",
        "organicAlternative": "Apply Fresh cow dung slurry supernatant (5%) foliar spray.",
        "prevention": "Drain field temporarily and avoid excessive nitrogen application during tillering."
    },
    "Rice Brown Spot (Helminthosporium)": {
        "disease": "Rice Brown Spot",
        "severity": "moderate",
        "treatment": "Apply Edifenphos 50% EC @ 1ml/L or Mancozeb 75% WP @ 2g/L.",
        "fungicide": "Mancozeb 75% WP / Edifenphos",
        "organicAlternative": "Spray 5% Neem seed kernel extract.",
        "prevention": "Correct soil nutrient deficiencies, particularly Potassium and Silicon."
    },
    "Rice Blast (Magnaporthe oryzae)": {
        "disease": "Rice Blast",
        "severity": "high",
        "treatment": "Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L.",
        "fungicide": "Tricyclazole 75% WP",
        "organicAlternative": "Apply Bio-agent Pseudomonas fluorescens @ 10g/L.",
        "prevention": "Maintain standing water in field during critical growth stages."
    },
    "Cotton Bacterial Blight (Xanthomonas malvacearum)": {
        "disease": "Cotton Bacterial Blight",
        "severity": "high",
        "treatment": "Spray Streptocycline @ 0.2g/L + Copper Oxychloride @ 2.5g/L.",
        "fungicide": "Copper Oxychloride + Streptocycline",
        "organicAlternative": "Apply Panchagavya 3% foliar spray.",
        "prevention": "Acid delint seed prior to planting."
    },
    "Cotton Leaf Curl Virus": {
        "disease": "Cotton Leaf Curl Virus",
        "severity": "high",
        "treatment": "Control whitefly vector using Diafenthiuron 50% WP @ 1g/L.",
        "fungicide": "Vector Insecticide (Diafenthiuron / Spiromesifen)",
        "organicAlternative": "Deploy Yellow Sticky Cards + Neem Oil 10,000 ppm.",
        "prevention": "Eradicate alternate weed hosts near field perimeters."
    },
    "Cotton Target Spot (Corynespora)": {
        "disease": "Cotton Target Spot",
        "severity": "moderate",
        "treatment": "Apply Pyraclostrobin 20% WG @ 1g/L or Fluxapyroxad.",
        "fungicide": "Pyraclostrobin 20% WG",
        "organicAlternative": "Spray Trichoderma viride (5g/L).",
        "prevention": "Avoid continuous cotton cropping."
    },
    "Leaf Blight (Alternaria / Bipolaris)": {
        "disease": "Leaf Blight",
        "severity": "high",
        "treatment": "Apply Mancozeb 75% WP @ 2.5g/L or Azoxystrobin spray every 7-10 days upon first symptom appearance.",
        "fungicide": "Mancozeb 75% WP / Tebuconazole 25.9% EC",
        "organicAlternative": "Spray Neem seed kernel extract (5ml/L) + Trichoderma viride bio-fungicide (5g/L).",
        "prevention": "Ensure disease-free certified seeds, practice 2-year crop rotation, and avoid overhead sprinkler irrigation."
    },
    "Early Blight (Alternaria solani)": {
        "disease": "Early Blight",
        "severity": "high",
        "treatment": "Apply Chlorothalonil 75% WP @ 2g/L or Difenoconazole 25% EC @ 0.5ml/L.",
        "fungicide": "Chlorothalonil / Difenoconazole",
        "organicAlternative": "Bio-fungicide Bacillus subtilis @ 5g/L + Copper hydroxide spray.",
        "prevention": "Remove lower infected foliage, mulch around plant base, and maintain optimal drip irrigation."
    },
    "Powdery Mildew (Erysiphe)": {
        "disease": "Powdery Mildew",
        "severity": "moderate",
        "treatment": "Spray Wettable Sulphur 80% WP @ 3g/L or Hexaconazole 5% EC @ 1ml/L.",
        "fungicide": "Wettable Sulphur 80% WP / Hexaconazole 5% EC",
        "organicAlternative": "Apply baking soda solution (5g/L) mixed with liquid horticultural oil or neem oil.",
        "prevention": "Maintain wider plant spacing to enhance airflow and remove crop residue post-harvest."
    },
    "Leaf Spot (Cercospora)": {
        "disease": "Leaf Spot",
        "severity": "moderate",
        "treatment": "Apply Carbendazim 50% WP @ 1g/L or Zineb 75% WP @ 2g/L.",
        "fungicide": "Carbendazim 50% WP",
        "organicAlternative": "Spray 10% Cow urine extract + neem leaf decoction.",
        "prevention": "Destroy infected plant debris and avoid nitrogen over-fertilization."
    }
}

def get_treatment_details(disease_label: str) -> Dict[str, Any]:
    """Returns treatment, organic alternative, fungicide, and prevention for a disease label."""
    if not disease_label:
        return TREATMENT_DATABASE["Healthy Leaf"]

    # 1. Exact match
    if disease_label in TREATMENT_DATABASE:
        return TREATMENT_DATABASE[disease_label]

    # 2. Case-insensitive substring match
    disease_label_lower = disease_label.lower()
    for key, data in TREATMENT_DATABASE.items():
        if key.lower() in disease_label_lower or disease_label_lower in key.lower():
            return data

    # 3. Fallback matching
    if "early blight" in disease_label_lower:
        return TREATMENT_DATABASE["Tomato Early Blight (Alternaria solani)"]
    elif "late blight" in disease_label_lower:
        return TREATMENT_DATABASE["Tomato Late Blight (Phytophthora infestans)"]
    elif "rust" in disease_label_lower:
        return TREATMENT_DATABASE["Wheat Yellow Stripe Rust (Puccinia striiformis)"]
    elif "healthy" in disease_label_lower:
        return TREATMENT_DATABASE["Healthy Leaf"]

    return TREATMENT_DATABASE["Tomato Early Blight (Alternaria solani)"]
