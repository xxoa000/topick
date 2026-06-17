package com.lch.topick.web.store.def.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lch.topick.web.menu.def.entity.Menu;
import com.lch.topick.web.menu.def.repository.MenuRepository;
import com.lch.topick.web.myLocationSet.entity.MyLocationSet;

import jakarta.persistence.Column;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class StoreServiceImpl implements StoreService {
	private final ObjectMapper objectMapper;
	private final MenuRepository repository;

	public void saveMenuData(String jsonResult, String jsonResult2, Long storeNo) {
		try {
			JsonNode kakaoMenuData = objectMapper.readTree(jsonResult).findValue("menu").findValue("menus")
					.findValue("items");
			
			String defaultMenuImage = objectMapper.readTree(jsonResult).findValue("menu").findValue("default_menu_icon_url").asText();
			log.warn(defaultMenuImage);
			
			if (jsonResult2 != null) {
				JsonNode yogiyoMenuData = objectMapper.readTree(jsonResult2).findValue("menu");

				for (JsonNode itemNode : yogiyoMenuData) {
					String menuName = itemNode.path("name").asText();
					String menuImage = itemNode.path("thumbnail").path("image").asText();
					Integer menuPrice = itemNode.path("price").path("final_price").asInt();
					Integer menuStock = itemNode.hasNonNull("stock_amount") ? itemNode.path("stock_amount").asInt()
							: 999;
					String menuContent = itemNode.path("description").asText();
					String menuStatus = "active";

//					System.out.printf("[요기요] 메뉴: %s, 이미지: %s, 가격: %d, 재고: %d, 설명: %s, 품절: %s \n", menuName, menuImage,
//							menuPrice, menuStock, menuContent, menuStatus);

					Optional<Menu> existingMenu = repository.findByStoreNoAndMenuName(storeNo, menuName);
					Menu entity;
					if (existingMenu.isPresent()) {
						Long existingMenuNo = existingMenu.get().getMenuNo();
						entity = Menu.builder()
								.menuNo(existingMenuNo)
								.storeNo(storeNo)
								.menuName(menuName)
								.menuImage(menuImage)
								.menuPrice(menuPrice)
								.menuStock(menuStock)
								.menuContent(menuContent)
								.menuStatus(menuStatus)
								.build();
					} else {
						entity = Menu.builder()
								.storeNo(storeNo)
								.menuName(menuName)
								.menuImage(menuImage)
								.menuPrice(menuPrice)
								.menuStock(menuStock)
								.menuContent(menuContent)
								.menuStatus(menuStatus)
								.build();
					}
					repository.save(entity);
				} // for

			} else {
				for (JsonNode itemNode : kakaoMenuData) {
					String menuName = itemNode.path("name").asText();
					String menuImage = defaultMenuImage;
					Integer menuPrice = itemNode.path("price").asInt();
					Integer menuStock = 999;
					String menuContent = itemNode.path("ai_mate_desc").asText();

//					System.out.printf("[요기요] 메뉴: %s, 이미지: %s, 가격: %d, 재고: %d, 설명: %s \n", menuName, menuImage,
//							menuPrice, menuStock, menuContent);

					Optional<Menu> existingMenu = repository.findByStoreNoAndMenuName(storeNo, menuName);
					Menu entity;
					if (existingMenu.isPresent()) {
						Long existingMenuNo = existingMenu.get().getMenuNo();
						entity = Menu.builder()
								.menuNo(existingMenuNo)
								.storeNo(storeNo)
								.menuName(menuName)
								.menuImage(menuImage)
								.menuPrice(menuPrice)
								.menuStock(menuStock)
								.menuContent(menuContent)
								.menuStatus("inactive")
								.build();
					} else {
						entity = Menu.builder()
								.storeNo(storeNo)
								.menuName(menuName)
								.menuImage(menuImage)
								.menuPrice(menuPrice)
								.menuStock(menuStock)
								.menuContent(menuContent)
								.menuStatus("inactive")
								.build();
					}
					
					repository.save(entity);
				} // for
			}
		} catch (Exception e) {
			log.error("repository.save" + e);
		}
	}
	// jsonResult, jsonResult2, storeNo 를 받아서 storeEntity 를 생성해야함
	// jsonResult2가 있으면 jsonResult2에서 menu 안에 요소별로 있는 매뉴의 name, price, description,
	// soldout 를 추출
	// jsonResult2가 없으면 jsonResult에서 menu.menus.item 안에 배열에 각각 name, price 만 추출해줘
}
