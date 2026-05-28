package com.lch.topick.web.myLocationSet.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lch.topick.web.myLocationSet.entity.MyLocationSet;
import com.lch.topick.web.myLocationSet.repository.KakaoAddressRepository;
import com.lch.topick.web.myLocationSet.repository.MyLocationSetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyLocationSetServiceImpl implements MyLocationSetService{

	private final MyLocationSetRepository myLocationSetRepository;
	
	@Override
	public List<MyLocationSet> selectList() {
		return myLocationSetRepository.findAll();
	}//selectList
	
	@Override
	public MyLocationSet selectOne(int addressNo) {
		Optional<MyLocationSet> result = myLocationSetRepository.findById(addressNo);
		if(result.isPresent()) return result.get();
		else return null;
	}//selectOne
	
	@Override
	public MyLocationSet save(MyLocationSet entity) {
		return myLocationSetRepository.save(entity);
	}//save
	
	@Override
	public void deleteById(int id) throws Exception {
		if(!myLocationSetRepository.existsById(id)) {
			throw new Exception("Member Delete_Data Not Found, id=" + id);
		} else {
			myLocationSetRepository.deleteById(id);
		}
	}//deleteById

	@Override
	public List<MyLocationSet> findByMemberId(String memberId) {
		return myLocationSetRepository.findByMemberId(memberId);
	}
}
