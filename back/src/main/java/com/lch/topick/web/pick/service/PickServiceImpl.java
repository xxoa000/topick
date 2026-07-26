package com.lch.topick.web.pick.service;

import com.lch.topick.web.pick.domain.PickDomain;
import com.lch.topick.web.pick.entity.PickEntity;
import com.lch.topick.web.pick.repository.PickRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor // 생성자를 통해 리포지토리를 자동으로 주입받음
public class PickServiceImpl implements PickService {

    private final PickRepository pickRepository;

    @Override
    public List<String> getRecommendedFood(PickDomain request) {
        //전체 음식 목록
        List<PickEntity> allFoods = pickRepository.findAll();

        //사용자가 선호하지 않는 카테고리는 아예 제외
        List<PickEntity> filteredFoods = allFoods.stream()
                .filter(food -> !request.getFoodExcludeCategory().contains(food.getFoodExcludeCategory()))
                .collect(Collectors.toList());

        //food랑 score 세트 클래스
        class ScoredFood {
            PickEntity food;
            int score;
            ScoredFood(PickEntity food, int score) { this.food = food; this.score = score; }
        }

        List<ScoredFood> scoredList = new ArrayList<>();

        //사용자 취향과 일치하는 항목을 가진 food에 점수 부여(+1)
        for (PickEntity food : filteredFoods) {
            int score = 0;

            if (food.getFoodTemp().equals(request.getFoodTemp())) score++;

            if (food.getFoodIsSoup().equals(request.getFoodIsSoup())) score++;

            if (request.getFoodMainIngredient() != null &&
                request.getFoodMainIngredient().contains(food.getFoodMainIngredient())) {
                score++;
            }

            if (request.getFoodFlavor() != null &&
                request.getFoodFlavor().contains(food.getFoodFlavor())) {
                score++;
            }

            if (food.getFoodFullness().equals(request.getFoodFullness())) score++;

            // 로그 출력
            log.info("음식: {}, 점수: {}", food.getFoodName(), score);

            scoredList.add(new ScoredFood(food, score));
        }

        //score가 같은 food 랜덤으로 섞기
        Collections.shuffle(scoredList);

        //상위권 food_name 3개 출력
        return scoredList.stream()
                .sorted((a, b) -> b.score - a.score) // score 내림차순 정렬 (score가 높은 음식부터 나열)
                .limit(3)                            // 3개만 추출
                .map(sf -> sf.food.getFoodName())    // 이름(String)으로 변환
                .collect(Collectors.toList());
    }
}