package com.lch.topick.web.menu.def.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.lch.topick.web.menu.def.entity.Menu;
import com.lch.topick.web.menu.def.repository.MenuRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {
	private final MenuRepository repository;

	/* 식당 리스트 > 식당 상세 > 메뉴 리스트 */
	@Override
	public List<Menu> selectList(Long storeNo) {
		return repository.findByStoreNo(storeNo);
	}

	/* 식당 리스트 > 식당 상세 > 메뉴 리스트 > 특정 메뉴 */
	@Override
	public List<Menu> selectOne(Long menuNo) {
		return repository.findByStoreNo(menuNo);
	}

	/* 특정 메뉴 추가, 수정 */
	@Override
	public Long save(Menu entity) {
		return repository.save(entity).getMenuNo();
	}

	/* 특정 메뉴 삭제 */
	@Override
	public void delete(Long menuNo) throws Exception {

	}

}// class
