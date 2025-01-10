"use client";
import { useState, useEffect } from "react";

export default function NameCenter() {
    const [Item, setItem] = useState("Criativo");

    async function delayLoop() {
        while (Item != "") {
            console.log({Item});
            setItem(Item.slice(0,-1)); 
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    
    delayLoop();
    return (
        <section className="h-[75vh] w-full flex flex-col justify-center items-center">
            <p className="text-[7vw] font-bold">RAFAEL COELHO</p>
            <p className="text-[5vw] font-extralight -mt-[3vh]">
                Desenvolvedor <span className="text-red-600">{Item}</span>
            </p>
        </section>
    );
}
