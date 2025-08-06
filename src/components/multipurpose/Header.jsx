import { useState } from "react";
import { ChevronDown, ChevronUp, Linkedin, Github } from "lucide-react";
import "../../App.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const normalColorPlease = "#F8EFEA";

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className="header fixed top-0 pl-4 w-full bg-neutral z-50 flex items-center px-4 pt-2"
        style={{ backgroundColor: normalColorPlease }}
      >
        <div
          onClick={toggleDropdown}
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity text-primary"
        >
          siiiift
          {isOpen ? (
            <ChevronUp size={16} className="ml-1" />
          ) : (
            <ChevronDown size={16} className="ml-1" />
          )}
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div
          className="fixed top-14 left-1 overflow-y-scroll md:left-4 bg-neutral shadow-lg max-w-sm md:max-w-2xl rounded-lg z-50 transition-all duration-200 ease-in-out border border-secondary"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
            backgroundColor: normalColorPlease,
          }}
        >
          <div className="aspect-video mb-4 w-full">
            <iframe
              src="https://www.loom.com/embed/62cc6095ed4f4f8f9f20323ec04af4e9"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-primary">
              about siiiift
            </h3>
            <div className="text-primary">
              <p className="mb-4">
                welcome to siiiift, your AI-powered baking journaling bestie.
                siiiift allows you to connect with other bakers, share recipes,
                and learn from your mistakes. That bûche de Noel that you
                botched last year and ruined the holidays? Find out what went
                wrong. That most perfect croquembouche that no one thought you
                could pull off? Share it with a community that gets it. Make the
                same birthday cake for that one friend every year? Get feedback
                on how you can make it even more magical at candle time next
                year.
              </p>

              <p className="mb-4">
                Now with powerful recipe retrieval functionality, siiiift can
                analyze recipes from URLs, images, or text - meaning you can get
                AI feedback on literally any bake, anywhere. Plus, it integrates
                No Hands Baking! functionality, allowing recipes to be read
                aloud with voice-controlled pacing to keep your hands free while
                you work!
              </p>

              <div className="space-y-4">
                <section>
                  <h4 className="font-semibold mb-2 text-primary">
                    tech stack
                  </h4>
                  <div className="text-sm space-y-2">
                    <div>
                      <strong>Frontend:</strong> React.js, TailwindCSS, DaisyUI,
                      Lucide Icons
                    </div>
                    <div>
                      <strong>Backend:</strong> Node.js, Express, Render hosting
                    </div>
                    <div>
                      <strong>Database & Auth:</strong> Supabase (Database,
                      Storage, Authentication, Edge Functions)
                    </div>
                    <div>
                      <strong>AI & Processing:</strong> Google Gemini, Cheerio
                      (web scraping), Sharp (image processing)
                    </div>
                    <div>
                      <strong>Voice Integration:</strong> Web Speech API
                    </div>
                    <div>
                      <strong>Development:</strong> ESLint, Prettier, Jest,
                      Supertest, Bottleneck (rate limiting)
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="font-semibold mb-2 text-primary">about me</h4>
                  <p className="mb-2">
                    my name is Megan Forsey and I am a hobby baker and the
                    architect of siiiift. I built this project to learn
                    full-stack development, but to be honest, I'm also just so
                    over trying to figure out pie crust on my own. Inspired by
                    that classic "OOPS! YOU ADDED TOO MUCH" cookie meme, I
                    realized visual textures can be incredibly helpful for
                    interpreting baking quality - helping bakers make mistakes
                    once and then learn from them.
                  </p>
                  <div className="flex gap-4 mt-2">
                    <a
                      href="https://www.linkedin.com/in/meganforsey?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      <Linkedin size={40} color="#496354" />
                    </a>
                    <a
                      href="https://github.com/mpartificer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      <Github size={40} color="#496354" />
                    </a>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for closing dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary/20 z-40"
          onClick={toggleDropdown}
        />
      )}
    </>
  );
}

export default Header;
