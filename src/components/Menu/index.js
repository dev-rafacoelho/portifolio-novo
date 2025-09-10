import Link from "next/link";

export default function Menu() {
  return (
    <section className="w-full pl-[3vw] pt-[3vh]">
      <Link
        className="text-3xl text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
        href="#"
      >
        Rafael Coelho{" "}
        <span className="text-red-600 dark:text-red-400">| Dev</span>
      </Link>
    </section>
  );
}
