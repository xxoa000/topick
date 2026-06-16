package com.lch.topick.web.store.def.service;

public interface StoreProxyService {

	String fetchStoreData(String kakaoId);
	
	String fetchMenuData(String yogiyId, String lat, String lng);
}
