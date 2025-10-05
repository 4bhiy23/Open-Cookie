import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function OpenCookieLanding() {
  const { login, isAuthenticated } = useAuth();
  const [repoUrl, setRepoUrl] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [cookies, setCookies] = useState([]);
  const [isLooping, setIsLooping] = useState(false);
  const controls = useAnimation();

  const cookieTexts = [
    "Add unit tests 🍪",
    "Fix README 🍪",
    "Refactor login flow 🍪",
  ];

  // generate floating background cookies
  useEffect(() => {
    const generated = Array.from({ length: 15 }).map(() => ({
      id: Math.random(),
      left: Math.random() * 100,
      delay: Math.random() * 4,
      size: 20 + Math.random() * 25,
      duration: 8 + Math.random() * 6,
    }));
    setCookies(generated);
  }, []);

  const handleScan = () => {
    if (!repoUrl) {
      setRepoUrl("");
    }
    setScanResult("Scanning your repo...");
    setIsLooping(true);
    startLoop();
  };

  const startLoop = () => {
    controls.start({
      y: [-5, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    });
    let typed = "";
    const text = "https://github.com/open-cookie/demo-repo";
    let i = 0;

    const typing = setInterval(() => {
      typed += text[i];
      setRepoUrl(typed);
      i++;
      if (i === text.length) {
        clearInterval(typing);
        setScanResult("✅ Repo scanned successfully!");
        triggerCookieAnimation();
      }
    }, 70);
  };

  const triggerCookieAnimation = () => {
    setTimeout(() => {
      controls.start({
        y: -20,
        transition: { duration: 0.6, ease: "easeInOut" },
      });
    }, 400);

    const loop = setInterval(() => {
      setScanResult("✅ Repo scanned successfully!");
      controls.start({
        y: [-10, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      });
    }, 7000);

    return () => clearInterval(loop);
  };

  return (
    <div className="relative min-h-screen bg-[#f6e0bf] text-[#5a1c1c] overflow-hidden flex flex-col">
      {/* Background floating cookies */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {cookies.map((c) => (
          <motion.div
            key={c.id}
            initial={{ y: "-10%", opacity: 0 }}
            animate={{ y: ["-10%", "140%"], opacity: [0, 1, 0] }}
            transition={{
              duration: c.duration,
              repeat: Infinity,
              delay: c.delay,
              ease: "easeInOut",
            }}
            className="absolute"
            style={{ left: `${c.left}%`, fontSize: `${c.size}px` }}
          >
            🍪
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:px-12">
        <div className="flex items-center gap-4">
          <div className="backdrop-blur-sm bg-white/30 rounded-md p-1 flex items-center">
            <img
              src="/logo.png"
              alt="Open-Cookie logo"
              className="h-14 relative"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <Button
              className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button
              className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
              onClick={login}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Connect GitHub Account
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col md:flex-row items-center justify-center flex-1 px-6 md:px-12 gap-12">
        <div className="max-w-xl">
          <h2 className="text-7xl md:text-6xl font-extrabold leading-tight mb-4">
            Find the cookie-lickers in your repo — fast.
          </h2>
          <p className="text-lg text-[#5a1c1c99] mb-6">
            Open-Cookie scans commits, PRs and CI logs to detect when someone
            (or something) consumed cookies they shouldn't.
          </p>
          <div className="flex gap-4 mb-4">
            {isAuthenticated ? (
              <Button 
                className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
                onClick={login}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                Connect GitHub Account
              </Button>
            )}
            <Button
              variant="outline"
              className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
            >
              Explore More →
            </Button>
          </div>
          <p className="text-[#5a1c1c99]">Team — Syntax Syndicate</p>
        </div>

        {/* Scan Demo */}
        <motion.div
          id="scanBox"
          animate={controls}
          className="max-w-sm w-full relative"
        >
          <Card className="backdrop-blur-sm bg-white/70 border border-[#5a1c1c20] rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Quick repo scan</h3>
              <p className="text-sm text-[#5a1c1c99] mb-4">
                Paste a public GitHub repo URL and we'll simulate a cookie-lick
                scan.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/your/repo"
                  className="flex-1 border border-[#5a1c1c20] rounded-lg px-3 py-2 focus:outline-none"
                  disabled={true}
                />
                <Button
                  className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
                  onClick={handleScan}
                >
                  Scan
                </Button>
              </div>
              {scanResult && (
                <p className="mt-3 text-sm font-semibold text-[#5a1c1c]">
                  {scanResult}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Animated cookies appear below */}
          {isLooping && (
            <div className="absolute w-full top-full mt-4 flex flex-col items-center space-y-3">
              {cookieTexts.map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ y: -100, opacity: 0, rotate: 0 }}
                  animate={{
                    y: [0, 80, 120],
                    opacity: [0, 1, 1, 0],
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    delay: i * 0.5, // wave offset
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                  className="bg-[#fff3df] border border-[#5a1c1c20] px-5 py-2 rounded-xl shadow-md text-[#5a1c1c] font-semibold"
                >
                  {t}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <footer className="relative z-10 p-6 text-center text-sm text-[#5a1c1c99]">
        Built for the hackathon • Open-Cookie © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
