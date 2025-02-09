import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  HelpCircle,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const standardSuperpowers = [
  "Flying",
  "Super Strength",
  "Invisibility",
  "Telekinesis",
  "Time Travel",
  "Healing",
  "Mind Reading",
  "Teleportation",
  "Energy Manipulation",
  "Shape Shifting",
];

const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 p-4 text-sm -top-2 left-full ml-2"
          >
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl w-64 shadow-lg border border-gray-200">
              {text ? (
                text
              ) : (
                <>
                  <h4 className="font-semibold mb-2">Common Superpowers:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {standardSuperpowers.map((power) => (
                      <div key={power} className="text-gray-600">
                        {power}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroCard = ({ hero }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
  >
    <h3 className="font-bold text-lg mb-2 text-gray-800">{hero.name}</h3>
    <p className="text-gray-600 mb-3">{hero.superpower}</p>
    <div className="flex items-center">
      <span className="text-sm text-gray-500">Humility Score:</span>
      <span className="ml-2 font-medium text-violet-600">
        {hero.humilityScore}
      </span>
    </div>
  </motion.div>
);

const HeroForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [superpower, setSuperpower] = useState("");
  const [humilityScore, setHumilityScore] = useState("");

  const handleSuperpowerChange = async (value) => {
    setSuperpower(value);
    try {
      const response = await fetch(
        "https://superhero-backend-nu.vercel.app/suggest-score",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ superpower: value }),
        }
      );
      const data = await response.json();
      setHumilityScore(data.score.toFixed(1));
    } catch (error) {
      console.error("Error getting suggested score:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, superpower, humilityScore });
    setName("");
    setSuperpower("");
    setHumilityScore("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Name
        </label>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <div className="relative">
        <div className="flex items-center mb-1">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Superpower
          </label>
          <Tooltip>
            <HelpCircle className="ml-2 w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          value={superpower}
          onChange={(e) => handleSuperpowerChange(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <div>
        <div className="flex items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Humility Score (1-10)
          </label>
          <Tooltip text="A measure of how humble the superhero is. Higher scores indicate greater humility and self-awareness, while lower scores suggest more ego-driven behavior.">
            <HelpCircle className="ml-2 w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="number"
          min="1"
          max="10"
          step="0.1"
          value={humilityScore}
          onChange={(e) => setHumilityScore(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full bg-violet-500 text-white p-2 rounded-lg hover:bg-violet-600 transition-colors"
      >
        Add Superhero!
      </motion.button>
    </motion.form>
  );
};
const HeroList = ({ hero }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-white p-4 border-b hover:bg-gray-50 transition-colors"
  >
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-bold text-gray-800">{hero.name}</h3>
        <p className="text-gray-600 text-sm">{hero.superpower}</p>
      </div>
      <div className="text-violet-600 font-medium">
        Score: {hero.humilityScore}
      </div>
    </div>
  </motion.div>
);

const App = () => {
  const [heroes, setHeroes] = useState([]);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState("card");
  const [sortAscending, setSortAscending] = useState(false);
  const [selectedPower, setSelectedPower] = useState("all");

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const response = await fetch(
        "https://superhero-backend-nu.vercel.app/superheroes"
      );
      const data = await response.json();
      setHeroes(data);
    } catch (error) {
      console.error("Error fetching heroes:", error);
    }
  };
  const handleAddHero = async (heroData) => {
    try {
      await fetch("https://superhero-backend-nu.vercel.app/superheroes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroData),
      });
      fetchHeroes();
    } catch (error) {
      console.error("Error adding hero:", error);
    }
  };

  const groupedHeroes = heroes.reduce((acc, hero) => {
    const power = hero.superpower.toLowerCase();
    if (!acc[power]) acc[power] = [];
    acc[power].push(hero);
    return acc;
  }, {});

  const uniquePowers = [
    "all",
    ...new Set(heroes.map((h) => h.superpower.toLowerCase())),
  ];

  const filteredAndSortedHeroes =
    selectedPower == "all"
      ? [...heroes].sort((a, b) =>
          sortAscending
            ? a.humilityScore - b.humilityScore
            : b.humilityScore - a.humilityScore
        )
      : [...heroes]
          .filter((h) => h.superpower.toLowerCase() === selectedPower)
          .sort((a, b) =>
            sortAscending
              ? a.humilityScore - b.humilityScore
              : b.humilityScore - a.humilityScore
          );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <motion.div
        initial={false}
        animate={{ width: isLeftPanelOpen ? 320 : 0 }}
        className="bg-white shadow-lg relative min-h-screen"
      >
        <div className="p-6 h-full">
          <AnimatePresence>
            {isLeftPanelOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <h2 className="text-xl z-20 font-bold mb-6 text-gray-800">
                  Add New Superhero 🦸🏼
                </h2>
                <HeroForm onSubmit={handleAddHero} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          className={`absolute ${
            isLeftPanelOpen ? "right-4" : "-right-12"
          } top-4 bg-white p-3 rounded-full shadow-md text-violet-500`}
        >
          {isLeftPanelOpen ? <ChevronLeft /> : <ChevronRight />}
        </motion.button>
      </motion.div>

      <div className="flex-1 p-8 pl-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {heroes.length} Superheroes in our Town 🔥
          </h1>
          <div className="flex gap-4 items-center">
            <select
              value={selectedPower}
              onChange={(e) => setSelectedPower(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {uniquePowers.map((power) => (
                <option key={power} value={power}>
                  {power == "all"
                    ? "All Powers"
                    : power.charAt(0).toUpperCase() + power.slice(1)}
                </option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortAscending(!sortAscending)}
              className="p-2 rounded-full bg-white shadow-sm hover:shadow-md text-violet-500 transition-shadow"
            >
              <ArrowUpDown />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}
              className="p-2 rounded-full bg-white shadow-sm hover:shadow-md text-violet-500 transition-shadow"
            >
              {viewMode === "card" ? <List /> : <LayoutGrid />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedPower == "all" ? (
            viewMode === "card" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredAndSortedHeroes.map((hero) => (
                  <HeroCard hero={hero} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {filteredAndSortedHeroes.map((hero) => (
                  <HeroList hero={hero} />
                ))}
              </motion.div>
            )
          ) : (
            <motion.div
              key="grouped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {Object.entries(groupedHeroes)
                .filter(([power]) => power === selectedPower)
                .map(([power, heroes]) => (
                  <div key={power} className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700 capitalize">
                      {heroes.length} which can {power}!
                    </h3>
                    {viewMode === "card" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {heroes.map((hero) => (
                          <HeroCard key={hero.id} hero={hero} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {heroes.map((hero) => (
                          <HeroList key={hero.id} hero={hero} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
