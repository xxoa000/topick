package com.lch.topick.web.pick.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 실제 DB의 'food' 테이블과 domain 연결
 */

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "food") // 실제 DB 테이블 이름
public class PickEntity {

    @Id //PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Auto Increment
    private Long foodNo; // 음식 번호 

    // 음식 이름
    @Column(name = "food_name")
    private String foodName; 

    // 온도: 'HOT', 'COLD'
    @Column(name = "food_temp")
    private String foodTemp;

    // 제외하고 싶은 카테고리: '한식', '중식', '일식', '양식', '분식', '샌드위치/샐러드', '디저트', '없음'
    @Column(name = "food_exclude_category")
    private String foodExcludeCategory; 

 	// 국물 유무: 'Y', 'N'	
    @Column(name = "food_is_soup")
    private String foodIsSoup;

    // 메인재료: '곡류', '육류/해산물', '채소/과일류', '유제품류'
    @Column(name = "food_main_ingredient")
    private String foodMainIngredient;

    // 맛:'매콤', '달콤', '짭짤', '담백'
    @Column(name = "food_flavor")
    private String foodFlavor;

    // 포만감: '든든함', '가벼움'
    @Column(name = "food_fullness")
    private String foodFullness;
}