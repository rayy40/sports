import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="rounded-lg shadow-container overflow-hidden relative h-[300px] bg-primary p-6 space-y-4">
      <div className="overflow-hidden rounded-full size-[400px] absolute -translate-y-1/2 top-1/2 -left-[15%]  opacity-5">
        <Image
          style={{ objectFit: "cover" }}
          fill
          alt=""
          src={"https://media.api-sports.io/flags/gb.svg"}
        />
      </div>
      <div className="overflow-hidden rounded-full size-[400px] absolute -translate-y-1/2 top-1/2 -right-[15%] opacity-5">
        <Image
          style={{ objectFit: "cover" }}
          fill
          alt=""
          src={"https://media.api-sports.io/flags/be.svg"}
        />
      </div>
      <p className="text-center text-secondary-foreground font-medium">
        Lusail Stadium
      </p>
      <div className="flex flex-col mx-auto gap-6 w-full max-w-[700px]">
        <div className="flex items-center justify-between w-full gap-6">
          <div className="flex items-center gap-4 w-[250px]">
            <Image
              style={{
                borderRadius: "50%",
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
              width={60}
              height={60}
              alt=""
              src={"https://media.api-sports.io/flags/gb.svg"}
            />
            <h3 className="text-xl font-medium text-primary-foreground">
              Portugal
            </h3>
          </div>
          <div className="flex items-center gap-3 text-primary-foreground">
            <p className="text-2xl font-medium w-[50px] text-center">2</p>
            <span className="text-muted-foreground w-[25px] text-center font-semibold text-sm">
              FT
            </span>
            <p className="text-2xl font-medium w-[50px] text-center">3</p>
          </div>
          <div className="flex items-center justify-end gap-4 w-[250px]">
            <h3 className="text-xl font-medium text-primary-foreground">
              Belgium
            </h3>
            <Image
              style={{
                borderRadius: "50%",
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
              width={60}
              height={60}
              alt=""
              src={"https://media.api-sports.io/flags/be.svg"}
            />
          </div>
        </div>
        <div className="flex items-start justify-between gap-6 px-1">
          <div className="w-[250px] flex flex-col">
            <div className="flex items-center gap-4 text-secondary-foreground">
              <p>C Ronaldo</p>
              <span>18</span>
            </div>
            <div className="flex items-center gap-4 text-secondary-foreground">
              <p>C Ronaldo</p>
              <span>18</span>
            </div>
          </div>
          <div className="w-[250px] flex flex-col">
            <div className="flex items-center justify-end gap-4 text-secondary-foreground">
              <p>C Ronaldo</p>
              <span>18</span>
            </div>
            <div className="flex items-center justify-end gap-4 text-secondary-foreground">
              <p>C Ronaldo</p>
              <span>18</span>
            </div>
            <div className="flex items-center justify-end gap-4 text-secondary-foreground">
              <p>C Ronaldo</p>
              <span>18</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
