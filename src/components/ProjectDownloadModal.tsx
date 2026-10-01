import React, { useState } from 'react';
import { X, Download, Code2, Terminal, Check, Copy, FolderArchive, ExternalLink, Sparkles } from 'lucide-react';
import { downloadProjectZip } from '../utils/zipExport';

interface ProjectDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDownloadModal: React.FC<ProjectDownloadModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadProjectZip();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="bg-neutral-900 border border-neutral-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-850">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Visual Studio / VS Code 프로젝트 다운로드</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Full Source Code
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Visual Studio Code에서 바로 실행 가능한 전체 소스코드 패키지
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Action Banner */}
          <div className="bg-gradient-to-br from-blue-950/60 to-neutral-900 border border-blue-500/40 rounded-2xl p-5 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 mb-4 sm:mb-0">
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                <FolderArchive className="w-4 h-4" />
                <span>원클릭 압축 다운로드</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                campus-cafe-kiosk-vscode.zip
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                모든 컴포넌트, 엑셀 생성 모듈, 설정 파일(package.json, vite, tsconfig) 및 이미지가 포함되어 있습니다.
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shrink-0 cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-blue-900/30'
              }`}
            >
              {isZipping ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>압축 파일 생성 중...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>다운로드 완료!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>전체 코드 ZIP 다운로드</span>
                </>
              )}
            </button>
          </div>

          {/* Step-by-Step Guide for Visual Studio / VS Code */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Visual Studio Code에서 실행하는 4단계 방법</span>
            </h4>

            <div className="space-y-2.5">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-neutral-800/70 border border-neutral-750 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-700 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-xs space-y-1">
                  <strong className="text-neutral-200">ZIP 파일 다운로드 후 압축 해제</strong>
                  <p className="text-neutral-400 leading-relaxed">
                    상단의 <strong>[전체 코드 ZIP 다운로드]</strong> 버튼을 눌러 받은 <code className="text-amber-300 bg-neutral-900 px-1 py-0.5 rounded">campus-cafe-kiosk-vscode.zip</code> 파일의 압축을 컴퓨터에 풉니다.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-neutral-800/70 border border-neutral-750 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-700 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="text-xs space-y-1">
                  <strong className="text-neutral-200">VS Code에서 폴더 열기</strong>
                  <p className="text-neutral-400 leading-relaxed">
                    Visual Studio Code를 실행하고 상단 메뉴에서 <strong>[파일] → [폴더 열기...]</strong>를 눌러 압축을 푼 폴더를 선택합니다.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-neutral-800/70 border border-neutral-750 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-700 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="text-xs space-y-2 flex-1">
                  <strong className="text-neutral-200">터미널 열고 의존성(라이브러리) 설치</strong>
                  <p className="text-neutral-400">
                    VS Code에서 <kbd className="bg-neutral-900 px-1.5 py-0.5 rounded text-[11px] text-neutral-300 border border-neutral-700">Ctrl + `</kbd> (터미널 열기)를 누르고 아래 명령어를 입력합니다:
                  </p>
                  <div className="flex items-center justify-between bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 font-mono text-xs text-emerald-400">
                    <span>npm install</span>
                    <button
                      onClick={() => copyToClipboard('npm install', 'cmd1')}
                      className="text-neutral-400 hover:text-white p-1"
                      title="명령어 복사"
                    >
                      {copiedKey === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-xl bg-neutral-800/70 border border-neutral-750 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-700 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div className="text-xs space-y-2 flex-1">
                  <strong className="text-neutral-200">로컬 개발 서버 실행</strong>
                  <p className="text-neutral-400">
                    설치가 완료되면 개발 서버를 실행하고 브라우저로 확인합니다:
                  </p>
                  <div className="flex items-center justify-between bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 font-mono text-xs text-amber-400">
                    <span>npm run dev</span>
                    <button
                      onClick={() => copyToClipboard('npm run dev', 'cmd2')}
                      className="text-neutral-400 hover:text-white p-1"
                      title="명령어 복사"
                    >
                      {copiedKey === 'cmd2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    브라우저 주소창에 <code className="text-neutral-300">http://localhost:3000</code>을 열면 키오스크가 실행됩니다!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Included Files Summary */}
          <div className="bg-neutral-950/60 rounded-xl p-4 border border-neutral-800 space-y-2">
            <span className="text-xs font-semibold text-neutral-300 block">
              📦 ZIP 패키지에 포함된 주요 파일 목록
            </span>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-neutral-400 font-mono">
              <div>📁 src/App.tsx (전체 키오스크 로직)</div>
              <div>📁 src/utils/excelExport.ts (엑셀 생성)</div>
              <div>📁 src/data/menuData.ts (4대 메뉴)</div>
              <div>📁 src/components/*.tsx (키패드, 옵션, 영수증)</div>
              <div>📁 package.json (React 19 + Vite + Tailwind)</div>
              <div>📁 README.md (상세 한글 설명서)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Node.js v18 이상 환경에서 바로 실행 가능합니다.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
