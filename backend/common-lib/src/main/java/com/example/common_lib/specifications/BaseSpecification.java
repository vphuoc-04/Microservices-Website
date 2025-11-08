package com.example.common_lib.specifications;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;

public class BaseSpecification {
    // public static <T> Specification<T> keywordSpec(String keyword, String... fields) {
    //     return (root, query, criteriaBuiler) -> {
    //         if (keyword == null || keyword.isEmpty()) {
    //             return criteriaBuiler.conjunction();
    //         } 
    //         Predicate[] predicates = new Predicate[fields.length];
    //         for(int i = 0; i < fields.length; i++) {
    //             predicates[i] = criteriaBuiler.like(
    //                 criteriaBuiler.lower(root.get(fields[i])), 
    //                 "%" + keyword.toLowerCase() + "%"
    //             );
    //         }
    //         return criteriaBuiler.or(predicates);
    //     };
    // }



    public static <T> Specification<T> keywordSpec(String keyword, String[] fields) {
        if (keyword == null || keyword.trim().isEmpty()) { return null; }

        String[] keywords = keyword.trim().split("\\s+");
        Specification<T> finalSpec = null;

        for (String word : keywords) {
            Specification<T> wordSpec = (root, query, builder) -> {
                List<Predicate> predicates = new ArrayList<>();
                for (String field : fields) {
                    predicates.add(
                        builder.like(
                            builder.lower(root.get(field)),
                            "%" + word.toLowerCase() + "%"
                        )
                    );
                }
                return builder.or(predicates.toArray(new Predicate[0]));
            };
            finalSpec = (finalSpec == null) ? wordSpec : finalSpec.and(wordSpec);
        }

        return finalSpec;
    }

    public static <T> Specification<T> keywordSpecLoose(String keyword, String[] fields) {
        if (keyword == null || keyword.trim().isEmpty()) { 
            return null; 
        }
        StringBuilder patternBuilder = new StringBuilder("%");
        for (char c : keyword.toLowerCase().toCharArray()) {
            patternBuilder.append(c).append("%");
        }
        String pattern = patternBuilder.toString();

        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            for (String field : fields) {
                predicates.add(
                    builder.like(
                        builder.lower(root.get(field)),
                        pattern
                    )
                );
            }
            return builder.or(predicates.toArray(new Predicate[0]));
        };
    }



    public static <T> Specification<T> whereSpec(Map<String, String> filters) {
        return (root, query, criteriaBuiler) -> {
            List<Predicate> predicates = filters.entrySet().stream()
                .map(entry -> criteriaBuiler.equal(root.get(entry.getKey()), entry.getValue()))
                .collect(Collectors.toList());
            
            return criteriaBuiler.and(predicates.toArray(Predicate[]::new));
        };
    }
}
