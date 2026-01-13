# MediAssist AI

Medical RAG + ML 진단 보조 시스템

## Overview

MediAssist AI는 의료진이 환자 증상을 분석하고, 관련 의학 문헌을 검색하여 근거 기반 진단 의사결정을 지원하는 AI 시스템입니다.

## Features

- **증상 분석**: BioBERT + XGBoost 앙상블 모델을 사용한 증상 기반 질병 분류
- **의료 이미지 분석**: DenseNet121 기반 흉부 X-ray 분석 + Grad-CAM 시각화
- **RAG 문헌 검색**: PubMed 등 의학 문헌에서 관련 정보 검색 및 요약
- **위험도 평가**: 환자 상태에 따른 위험도 점수 산출

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy
- **Frontend**: React 18, TypeScript, TailwindCSS
- **ML/AI**: PyTorch, XGBoost, BioBERT, LangChain
- **Database**: PostgreSQL, Redis, ChromaDB
- **Infrastructure**: Docker, Kubernetes

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/mediassist-ai.git
cd mediassist-ai

# Copy environment file
cp .env.example .env

# Start development services
make dev

# Install dependencies
make install

# Run the analysis service
make run-analysis

# Run the frontend
make run-frontend
```

## Project Structure

```
mediassist-ai/
├── services/           # Microservices
│   ├── auth/          # Authentication service
│   ├── patient/       # Patient management
│   ├── analysis/      # ML analysis service
│   └── report/        # Report generation
├── models/            # ML models
├── rag/               # RAG system
├── frontend/          # React application
├── common/            # Shared code
├── tests/             # Tests
└── k8s/               # Kubernetes configs
```

## API Documentation

After starting the services, API documentation is available at:
- Auth Service: http://localhost:8001/docs
- Analysis Service: http://localhost:8003/docs

## Disclaimer

이 시스템의 모든 분석 결과는 참고용이며, 최종 진단 및 치료 결정은 반드시 자격을 갖춘 의료 전문가가 수행해야 합니다.

## License

MIT License
