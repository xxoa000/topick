package com.lch.topick.web.client.def.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lch.topick.web.client.def.domain.ClientRequestDTO;
import com.lch.topick.web.client.def.entity.Client;
import com.lch.topick.web.client.def.repository.ClientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
	private final ClientRepository repository;

	/* 전체 고객 리스트 */
	@Override
	public List<Client> selectList() {
		return repository.findAll();
	}

	/* 고객 상세 */
	@Override
	public Client selectOne(String clientId) {
		return repository.findById(clientId).orElseThrow(() -> new RuntimeException("다시 시도해 주세요."));
	}

	
	// INSERT 새 계정 생성 
//	@Override
//	public Client save(ClientRequestDTO requestDto) {
//		Client entity = Client.builder()
//							.clientId(requestDto.getClientId())
//							.clientEmail(requestDto.getClientEmail())
//							.build();
//		return repository.save(entity);
//	}
	
	
	
	
	// UPDATE 기존 계정 수정
	@Override
	public Client save(String clientId, ClientRequestDTO requestDto) {
		Client entity = repository.findById(clientId)
				.orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));
		entity.setClientName(requestDto.getClientName());
		entity.setClientPhone(requestDto.getClientPhone());		
		
		return repository.save(entity);
	}

	
	
	
	@Override
	public void delete(String clientId) {
		repository.deleteById(clientId);
	}

}// class
