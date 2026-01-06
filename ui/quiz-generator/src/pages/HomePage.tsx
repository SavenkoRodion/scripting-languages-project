import "../fonts/PopArt-Regular.ttf";

export default function HomePage() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", textAlign: "center" }}
    >
      <div>
        <h1
          className="text-indigo-700"
          style={{ fontFamily: "PopArt", fontSize: "60px" }}
        >
          Welcome at Quiz Generator
        </h1>
        <h2 style={{ fontFamily: "Montserrat, sans-serif", fontSize: "30px" }}>
          Easy, fast, and fun quiz creation.
        </h2>
        <button
          style={{ backgroundColor: "#ff5722", marginTop: "30px" }}
          className="
            px-6 py-3
            bg-indigo-600 
            text-white 
            font-semibold 
            rounded-2xl
            shadow-md 
            transition-all 
            hover:bg-indigo-700 
            hover:shadow-lg 
            active:scale-95"
        >
          Let's started
        </button>
      </div>
    </div>
  );
}
