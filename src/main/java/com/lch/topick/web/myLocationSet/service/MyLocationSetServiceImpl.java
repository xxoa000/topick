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
	
	@Override
	public MyLocationSet findByMemberIdAndAddressDefault(String memberId, char addressDefault) {
		Optional<MyLocationSet> addrOpt = myLocationSetRepository.findByMemberIdAndAddressDefault(memberId, addressDefault);
		
		// 1. 데이터베이스에 값이 존재하면 조회된 객체를 꺼내서 즉시 반환
	    if (addrOpt.isPresent()) {
	        return addrOpt.get();
	    }
	    
	    // 2. 값이 없으면(null이면) 실행되는 블록: 기본값 세팅 후 반환
	    MyLocationSet addr = new MyLocationSet();
	    
	    addr.setAddressX("127.108932846326"); 
	    addr.setAddressY("37.3500951835995");
	    addr.setMemberId(memberId);
	    addr.setAddressDefault(addressDefault);
	    
	    return addr;
	}
	
	@Transactional
    public Map<String, String> changeDefaultAddress(long addressNo) {
        // 1. 수정 요청이 들어온 주소가 존재하는지 먼저 확인 및 조회
        MyLocationSet targetAddress = myLocationSetRepository.findById(addressNo)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주소 ID입니다: " + addressNo));
        
        // 만약 이미 default 인 주소를 선택 시 종료
        if(targetAddress.getAddressDefault()=='Y') {
        	return null;
        }
    	
        // 2. 해당 회원의 모든 주소록의 addressDefault를 먼저 'N'으로 초기화
        myLocationSetRepository.resetDefaultAddress(targetAddress.getMemberId());
        
        // 3. 선택된 주소만 'Y'로 변경 (JPA Dirty Checking에 의해 자동 update)
        targetAddress.setAddressDefault('Y');
        
        return Map.of("addressX", targetAddress.getAddressX(), "addressY", targetAddress.getAddressY());
    }
}
