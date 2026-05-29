package com.lch.topick.web.myLocationSet.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lch.topick.web.myLocationSet.entity.MyLocationSet;
import com.lch.topick.web.myLocationSet.repository.KakaoAddressRepository;
import com.lch.topick.web.myLocationSet.repository.MyLocationSetRepository;

import jakarta.transaction.Transactional;
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
	public MyLocationSet selectOne(long addressNo) {
		Optional<MyLocationSet> result = myLocationSetRepository.findById(addressNo);
		if(result.isPresent()) return result.get();
		else return null;
	}//selectOne
	
	@Override
	public MyLocationSet save(MyLocationSet entity) {
		return myLocationSetRepository.save(entity);
	}//save
	
	@Override
	public void deleteById(long id) throws Exception {
		if(!myLocationSetRepository.existsById(id)) {
			throw new Exception("Member Delete_Data Not Found, id=" + id);
		} else {
			myLocationSetRepository.deleteById(id);
		}
	}//deleteById

	@Override
	public List<MyLocationSet> findByMemberId(String memberId) {
		return myLocationSetRepository.findByMemberIdOrderByAddressDefaultDesc(memberId);
	}
	
	@Transactional // 🌟 데이터 정성 확보를 위해 꼭 붙여주세요!
    public void changeDefaultAddress(long addressNo) {
        // 1. 수정 요청이 들어온 주소가 존재하는지 먼저 확인 및 조회
        MyLocationSet targetAddress = myLocationSetRepository.findById(addressNo)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주소 ID입니다: " + addressNo));
        if(targetAddress.getAddressDefault()=='Y') {
            return;
        }
        
        // 2. 해당 회원의 모든 주소록의 addressDefault를 먼저 'N'으로 초기화
        myLocationSetRepository.resetDefaultAddress(targetAddress.getMemberId());
        
        // 3. 선택된 주소만 'Y'로 변경 (JPA Dirty Checking에 의해 자동 update)
        targetAddress.setAddressDefault('Y'); 
    }
}
