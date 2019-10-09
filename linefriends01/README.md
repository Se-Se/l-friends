# ncp-line

라인

NCP-LINE Vue Front Project


# 배포 (알파)

1. 좌측 Merge Requests 메뉴 접속
2. New merge request 버튼 클릭
3. Source branch 'develop' 선택  
4. Target branch 'release-*.*' 라스트버전 선택 (운영버전 적용여부에따라 release 브런치 버전 업데이트 예정 > 운영배포시 문제있을경우 전 브런치버전으로 복원)
5. Compare branches and continue 버튼 클릭
6. Title , Description 수정 적용버전 사항 입력 ( Assignee , Milestone , Labels 필요에따라 추가 입력 )
7. Submit merge request 버튼 클릭
8. 적용내역 및 충돌여부 확인후 "Merge" 버튼 클릭
9. 좌측 CI / CD 메뉴 접속 running 상태 확인 passed 시 적용 완료


# 베타 배포 추가 설정

### 단일 로드벨런싱일 경우 
sshfs centos@133.186.213.165:/www/line /www/line -o IdentityFile=/home/centos/real-line.pem -o nonempty

umount /www/line


### 서버 여러개일 경우 

git CI 추가등록 ( 쉘 스크립트 형태로 변경필요 )

: scp -i /home/centos/real-line.pem -r /www/line/dist/ centos@133.186.208.196:/www/line/dist
: scp -i /home/centos/real-line.pem -r /www/line/dist/ centos@133.186.208.197:/www/line/dist
