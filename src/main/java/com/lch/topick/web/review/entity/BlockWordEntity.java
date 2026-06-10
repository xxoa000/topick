package com.lch.topick.web.review.entity; // 기존 entity 폴더 위치에 맞춰주세요.

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "block_word")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BlockWordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "block_word_no")
    private Long blockWordNo;

    @Column(name = "block_word_name", nullable = false, length = 100)
    private String blockWordName;
}