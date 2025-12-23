import React from "react";
import {
  Paperclip,
  Mic,
  Send,
  Mail,
  ShoppingCart,
  Pencil,
  CodeXml,
  RefreshCw,
  ExternalLink,
  Route,
  User,
  Github,
  Maximize2,
} from "lucide-react";

import { useEffect } from "react";
import { useTour } from "@/components/Tour/tourContext";
import { HOME_COUNT } from "@/components/Tour/steps";



const DummyChatPage = () => {
  const { run, stepIndex, setStepIndex } = useTour();
   useEffect(() => {
    // 🟢 Start chat tour ONLY when coming from home tour
    if (run && stepIndex === HOME_COUNT - 1) {
      setStepIndex(HOME_COUNT);
    }
  }, []);
  return (
    <div className="h-screen w-full flex flex-col bg-[#0B0B0F] text-white overflow-hidden">
      {/* ================= TOP BAR ================= */}
      <header className="h-14 px-4 flex items-center border-b border-white/10">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-md" />
          <span className="text-sm font-semibold">adhesh-cart-582</span>

          <button className="text-white/60 hover:text-white">
            <Pencil size={16} />
          </button>

          <span className="text-xs text-white/60">Credits: 0</span>
        </div>

        {/* CENTER */}
        <div className="mx-auto flex items-center gap-4 text-white/60">
          <button id="preview-switcher" title="Switch to Code">
            <CodeXml size={18} />
          </button>
          <button id="refresh-preview-btn" title="Refresh">
            <RefreshCw size={18} />
          </button>
          <button id="open-preview-newtab-btn" title="Open in new tab">
            <ExternalLink size={18} />
          </button>
        </div>

        {/* BETWEEN CENTER & RIGHT */}
        <div id="page-dropdown-btn" className="mr-20 text-white/60">
          <Route  size={18} />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
  
          <button id="assign-to-dev-btn" className="flex items-center gap-1 text-sm text-white/70">
            <User size={16} />
            Assign to Dev
          </button>

          <button className="flex items-center gap-1 text-sm text-white/70">
            <Github  size={18} />
            Github
          </button>

          <button id="publish-btn" className="px-4 py-1.5 rounded-2xl bg-pink-600 text-sm">
            Publish
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* ================= LEFT CHAT ================= */}
        <aside className="w-[380px] flex flex-col border-r border-white/10 bg-[#0F0F14]">
          <div id="ai-response-panel" className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex justify-end">
              <div className="bg-pink-600 px-4 py-2 rounded-xl text-sm max-w-[85%]">
                create adhesh&apos;s E-com website
              </div>
            </div>

            <div className="bg-[#16161D] rounded-xl p-4 text-sm space-y-2">
              <p className="text-blue-400 font-medium">
                I&apos;ll help you create Adhesh&apos;s e-commerce website.
              </p>
              <p className="text-white/70">
                Let me start by analyzing your idea and then generate the
                frontend code for it.
              </p>

              <div className="mt-2 bg-black/30 rounded-md p-3 text-xs text-white/60">
                <p className="font-semibold mb-1">USER IDEA TO ANALYZE:</p>
                <p>
                  “Create Adhesh’s E-com website – a single seller online store”
                </p>
              </div>
            </div>
          </div>

          {/* INPUT */}
          <div className="p-4 border-t border-white/10">
            <div id="model-selector" className="text-xs text-white/60 mb-2">
              Model: <span className="text-white">Kimi K2</span>
            </div>

            <div className="flex items-center gap-2 bg-[#16161D] px-3 py-2 rounded-md border border-white/10">
              <Paperclip  id="file-upload-btns" size={18} className="text-white/60" />

              <input  id="chat-inputs"
                className="flex-1 bg-transparent outline-none text-sm"
                placeholder="Type your message or use '@' to call a tool..."
              />

              <Mic  id="voice-input-btns" size={18} className="text-white/60" />

              <button id="chat-send-btns" className="w-8 h-8 bg-pink-600 rounded-md flex items-center justify-center">
                <Send size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* ================= RIGHT PREVIEW ================= */}
        <main className="flex-1 bg-white text-black relative overflow-auto">
          {/* Preview Navbar */}
          <div className="h-14 px-10 flex items-center justify-between border-b">
            <h2 className="font-bold text-xl text-blue-600">LUMINA</h2>

            <nav className="flex gap-6 text-sm text-gray-700">
              <span>Home</span>
              <span>Shop</span>
              <span>About</span>
              <span>Contact</span>
            </nav>

            <div className="relative">
              <ShoppingCart size={18} />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                2
              </span>
            </div>
          </div>

          {/* Newsletter */}
          <section className="mx-10 my-10 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 flex justify-between">
            <div className="flex gap-3">
              <Mail className="text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Stay in the loop</h3>
                <p className="text-gray-600 text-sm">
                  Get exclusive drops, early access, and curated stories.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                className="px-4 py-2 border rounded-full text-sm outline-none"
                placeholder="your@email.com"
              />
              <button className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm">
                Subscribe
              </button>
            </div>
          </section>

          {/* DEVICE SWITCHER (CENTER BOTTOM) */}
          <div id="view-mode-buttons" className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white rounded-full px-4 py-2 flex gap-3 text-xs">
            <button className="px-3 py-1 rounded-full bg-pink-600">
              Web
            </button>
            <button   className="px-3 py-1 opacity-70">Mob</button>
            <button  className="px-3 py-1 opacity-70">Tab</button>
          </div>

          {/* FULLSCREEN (BOTTOM RIGHT – SEPARATE) */}
          <button  id="fullscreen-btn" className="absolute bottom-4 right-4 bg-black/80 text-white p-2 rounded-full">
            <Maximize2 size={16} />
          </button>
        </main>
      </div>
    </div>
  );
};

export default DummyChatPage;
