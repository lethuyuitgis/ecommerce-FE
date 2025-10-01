import Image from "next/image"

interface CategoryHeaderProps {
  name: string
  description: string
  image: string
}

export function CategoryHeader({ name, description, image }: CategoryHeaderProps) {
  return (
    <div className="relative h-64 bg-gradient-to-r from-teal-500 to-emerald-500 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
      </div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white">
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <p className="text-lg text-white/90">{description}</p>
      </div>
    </div>
  )
}
