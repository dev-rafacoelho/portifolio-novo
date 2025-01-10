import Link from "next/link";

export default function Menu(){
    return(
        <section className="w-full pl-[3vw] pt-[3vh]">
            <Link className="text-3xl t"
                  href="#"
            >
                Rafael Coelho <span className="text-red-600 ">| Dev</span>
            </Link>
        </section>
    )
}