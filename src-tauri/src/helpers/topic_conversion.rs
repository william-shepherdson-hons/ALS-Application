pub fn skill_name_to_api_string(input: &str) -> String {
    let normalized = input
        .to_lowercase()
        .replace('–', "-")
        .replace('&', "and");
    
    let domain = classify_domain(&normalized);
    let api_name = create_api_name(&normalized);
    
    format!("{domain}__{api_name}")
}

fn classify_domain(s: &str) -> &'static str {
    match s {
        s if s.contains("linear equation") => "algebra",
        s if s.contains("polynomial") || s.contains("sequence") => "algebra",
        s if s.contains("addition") || s.contains("subtraction") 
            || s.contains("multiplication") || s.contains("division")
            || s.contains("surd") || s.contains("root") => "arithmetic",
        s if s.contains("differentiat") => "calculus",
        s if s.contains("compare") || s.contains("closest") 
            || s.contains("largest") || s.contains("sorting")
            || s.contains("pairwise") => "comparison",
        s if s.contains("conversion") || s.contains("time") => "measurement",
        s if s.contains("prime") || s.contains("factor")
            || s.contains("gcd") || s.contains("lcm")
            || s.contains("remainder") || s.contains("round")
            || s.contains("place value") || s.contains("base") => "numbers",
        s if s.contains("probability") => "probability",
        _ => "general",
    }
}

fn create_api_name(s: &str) -> String {
    s.replace("probability without replacement", "swr")
        .replace("greatest common divisor", "gcd")
        .replace("least common multiple", "lcm")
        .replace("kth", "kth")
        .replace("one variable", "1d")
        .replace("two variables", "2d")
        .replace("chain rule", "composed")
        .replace("outcome sets", "p_level_set")
        .replace("outcome sequences", "p_sequence")
        .replace(|c: char| !c.is_ascii_alphanumeric() && c != ' ', "")
        .split_whitespace()
        .collect::<Vec<_>>()
        .join("_")
}