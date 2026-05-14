package com.lch.topick.web.client.def.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lch.topick.web.client.def.domain.ClientRequestDTO;
import com.lch.topick.web.client.def.entity.Client;
import com.lch.topick.web.client.def.repository.ClientRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional //데이터 변화를 자동감지 -> findById() 썼을 경우 save() 안해도 자동 수정 됨
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
	private final ClientRepository repository;

	/* SELECT 전체 고객 리스트 */
	@Override
	public List<Client> selectList() {
		return repository.findAll();
	}

	/* SELECT 고객 상세 */
	@Override
	public Client selectOne(String clientId) {
		return repository.findById(clientId).orElseThrow(() -> new RuntimeException("다시 시도해 주세요."));
	}

	/* INSERT 새 계정 생성 */
	@Override
	public Client insert(ClientRequestDTO dto) {
		
		if (repository.existsById(dto.getClientId())) throw new RuntimeException("이미 존재하는 회원입니다.");
		
		Client entity = Client.builder()
							.clientId(dto.getClientId())
							.clientPw(dto.getClientPw())
							.clientName(dto.getClientName())
							.clientEmail(dto.getClientEmail())
							.clientPhone(dto.getClientPhone())
							.clientGender(dto.getClientGender())
							.clientBirthday(dto.getClientBirthday())
							.build();
				
		return repository.save(entity);
	}


	/* UPDATE 기존 계정 부분(patch) 수정 */
	@Override
	public Client update(String clientId, ClientRequestDTO dto) {
		Client entity = repository.findById(clientId).orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));

		entity.patchInfo(dto.getClientName(), dto.getClientEmail(), dto.getClientPhone(), dto.getClientGender(),
				dto.getClientBirthday());
		return entity;
	}

	/* Delete 계정 삭제 */
	@Override
	public void delete(String clientId) {
		repository.deleteById(clientId);
	}

}// class
