// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// export default function OpenCookieLanding() {
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState("signup");
//   const [repoUrl, setRepoUrl] = useState("");
//   const [scanResult, setScanResult] = useState("");
//   const [cookies, setCookies] = useState([]);

//   useEffect(() => {
//     // generate cookie particles on mount
//     const generated = Array.from({ length: 15 }).map(() => ({
//       id: Math.random(),
//       left: Math.random() * 100,
//       delay: Math.random() * 4,
//       size: 20 + Math.random() * 25,
//       duration: 8 + Math.random() * 4,
//     }));
//     setCookies(generated);
//   }, []);

//   const handleScan = () => {
//     if (!repoUrl) {
//       setScanResult("Please paste a public GitHub repo URL.");
//       return;
//     }
//     setScanResult(`Scanning ${repoUrl} ...`);
//     setTimeout(() => {
//       setScanResult("✅ No cookie-lickers found! Your repo is clean.");
//     }, 1500);
//   };

//   return (
//     <div className="relative min-h-screen bg-[#f6e0bf] text-[#5a1c1c] overflow-hidden flex flex-col">
//       {/* Animated cookie particles */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {cookies.map((c) => (
//           <motion.div
//             key={c.id}
//             initial={{ y: "-100%", opacity: 0 }}
//             animate={{ y: "300%", opacity: [0.3, 1, 0.3] }}
//             transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: "linear" }}
//             className="absolute"
//             style={{ left: `${c.left}%`, fontSize: `${c.size}px` }}
//           >
//             🍪
//           </motion.div>
//         ))}
//       </div>

//       {/* Header */}
//       <header className="relative z-10 flex justify-between items-center p-6 md:px-12">
//         <div className="flex items-center gap-4">
//           <div className="backdrop-blur-sm bg-white/30 rounded-md p-1 flex items-center">
//             <img src="/logo.png" alt="Open-Cookie logo" className="h-14 relative" />
//             {/* <h1 className="text-2xl font-bold tracking-wide">Open-Cookie</h1>
//             <p className="text-sm text-[#5a1c1c99]">Smart Cookie-Lick Detection System</p> */}
//             {/* <img src="./public/Open.png" alt="" /> */}
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
//             onClick={() => {
//               setModalType("login");
//               setShowModal(true);
//             }}
//           >
//             Log in
//           </Button>
//           <Button
//             className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
//             onClick={() => {
//               setModalType("signup");
//               setShowModal(true);
//             }}
//           >
//             Sign up
//           </Button>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <main className="relative z-10 flex flex-col md:flex-row items-center justify-center flex-1 px-6 md:px-12 gap-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="max-w-xl"
//         >
//           <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
//             Find the cookie-lickers in your repo — fast.
//           </h2>
//           <p className="text-lg text-[#5a1c1c99] mb-6">
//             Open-Cookie scans commits, PRs and CI logs to detect when someone (or something) consumed cookies they shouldn't.
//           </p>
//           <div className="flex gap-4 mb-4">
//             <Button className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white">
//               Get started — it's free
//             </Button>
//             <Button
//               variant="outline"
//               className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
//               onClick={() => {
//                 document.getElementById("scanBox")?.scrollIntoView({ behavior: "smooth" });
//               }}
//             >
//               Try a quick scan
//             </Button>
//           </div>
//           <p className="text-[#5a1c1c99]">Team — Syntax Syndicate</p>
//         </motion.div>

//         {/* Scan Demo */}
//         <motion.div
//           id="scanBox"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//           className="max-w-sm w-full"
//         >
//           <Card className="backdrop-blur-sm bg-white/70 border border-[#5a1c1c20] rounded-2xl">
//             <CardContent className="p-6">
//               <h3 className="text-xl font-semibold mb-2">Quick repo scan</h3>
//               <p className="text-sm text-[#5a1c1c99] mb-4">
//                 Paste a public GitHub repo URL and we'll simulate a cookie-lick scan.
//               </p>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   value={repoUrl}
//                   onChange={(e) => setRepoUrl(e.target.value)}
//                   placeholder="https://github.com/your/repo"
//                   className="flex-1 border border-[#5a1c1c20] rounded-lg px-3 py-2 focus:outline-none"
//                 />
//                 <Button className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white" onClick={handleScan}>
//                   Scan
//                 </Button>
//               </div>
//               {scanResult && <p className="mt-3 text-sm font-semibold text-[#5a1c1c]">{scanResult}</p>}
//             </CardContent>
//           </Card>
//         </motion.div>
//       </main>

//       {/* Features */}
//       <section className="relative z-10 grid md:grid-cols-3 gap-4 p-6 md:px-12">
//         {[
//           { title: "Commit & PR Scanning", text: "Detect cookie reads/writes in diffs, commit messages, and code changes." },
//           { title: "CI Log Analysis", text: "Scan CI build logs for cookie exposures or suspicious tooling access." },
//           { title: "Easy Remediation", text: "Auto-generate PRs with fixes, and provide suggestions to rotate or secret-scan." },
//         ].map((f) => (
//           <Card key={f.title} className="bg-white border border-[#5a1c1c10] rounded-xl p-4">
//             <h4 className="font-semibold mb-2 text-lg">{f.title}</h4>
//             <p className="text-[#5a1c1c99] text-sm">{f.text}</p>
//           </Card>
//         ))}
//       </section>

//       <footer className="relative z-10 p-6 text-center text-sm text-[#5a1c1c99]">
//         Built for the hackathon • Open-Cookie © {new Date().getFullYear()}
//       </footer>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//           <Card className="max-w-sm w-full bg-white p-6 rounded-xl relative">
//             <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-xl text-[#5a1c1c]">
//               ✕
//             </button>
//             <h3 className="text-2xl font-bold mb-4 text-[#5a1c1c]">{modalType === "login" ? "Log in" : "Sign up"}</h3>
//             <div className="flex flex-col gap-3">
//               {modalType === "signup" && (
//                 <input type="text" placeholder="Full name" className="border border-[#5a1c1c20] rounded-lg px-3 py-2" />
//               )}
//               <input type="email" placeholder="Email" className="border border-[#5a1c1c20] rounded-lg px-3 py-2" />
//               <input type="password" placeholder="Password" className="border border-[#5a1c1c20] rounded-lg px-3 py-2" />
//               <div className="flex justify-end gap-2 mt-4">
//                 <Button
//                   variant="outline"
//                   className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
//                   onClick={() => {
//                     alert(`${modalType === "login" ? "Login" : "Signup"} submitted (demo).`);
//                     setShowModal(false);
//                   }}
//                 >
//                   Continue
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OpenCookieLanding() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("signup");
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
          <Button
            variant="outline"
            className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
            onClick={() => {
              setModalType("login");
              setShowModal(true);
            }}
          >
            Log in
          </Button>
          <Button
            className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
            onClick={() => {
              setModalType("signup");
              setShowModal(true);
            }}
          >
            Sign up
          </Button>
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
            <Button className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white">
              Get started — it's free
            </Button>
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

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <Card className="max-w-sm w-full bg-white p-6 rounded-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-xl text-[#5a1c1c]"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-[#5a1c1c]">
              {modalType === "login" ? "Log in" : "Sign up"}
            </h3>
            <div className="flex flex-col gap-3">
              {modalType === "signup" && (
                <input
                  type="text"
                  placeholder="Full name"
                  className="border border-[#5a1c1c20] rounded-lg px-3 py-2"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                className="border border-[#5a1c1c20] rounded-lg px-3 py-2"
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-[#5a1c1c20] rounded-lg px-3 py-2"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  className="border-[#5a1c1c] text-[#5a1c1c] hover:bg-[#5a1c1c10]"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#5a1c1c] hover:bg-[#7b2929] text-white"
                  onClick={() => {
                    alert(
                      `${
                        modalType === "login" ? "Login" : "Signup"
                      } submitted (demo).`
                    );
                    setShowModal(false);
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
