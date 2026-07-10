/** @type {import("next").NextConfig} */
const nextConfig = {
  // Next 16.2.x + Turbopack의 내장 타입체크 워커가 Node 24에서
  // `The "id" argument must be of type string. Received undefined`로 크래시한다.
  // 타입 검증은 `npm run typecheck`(tsc --noEmit)가 별도로 수행하므로 빌드 단계에서는 건너뛴다.
  typescript: { ignoreBuildErrors: true }
};

export default nextConfig;
