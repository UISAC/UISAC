import { Target, Eye, HeartHandshake } from "lucide-react";

type ScatteredPhoto = {
  key: string;
  src?: string;
  alt?: string;
  caption?: string;
  stripe?: string;
  aspect: string;
  mobileRotate: string;
  place: string;
};

const scatteredPhotos: ScatteredPhoto[] = [
  {
    key: "real",
    src: "/images/about.jpg",
    alt: "UISAC members gathered together as a community",
    aspect: "aspect-[4/5]",
    mobileRotate: "-rotate-2",
    place:
      "md:absolute md:z-20 md:w-[48%] md:top-[2%] md:left-[2%] md:-rotate-3",
  },
  {
    key: "cultural-night",
    caption: "PHOTO — cultural night performance",
    stripe: "#e6dcf2 0px, #e6dcf2 14px, #d2c1e6 14px, #d2c1e6 28px",
    aspect: "aspect-square",
    mobileRotate: "rotate-3",
    place:
      "md:absolute md:z-10 md:w-[36%] md:top-[-6%] md:right-[-2%] md:rotate-9",
  },
  {
    key: "welcome-fair",
    caption: "PHOTO — campus welcome fair",
    stripe: "#fef1de 0px, #fef1de 14px, #f6d9a0 14px, #f6d9a0 28px",
    aspect: "aspect-[5/4]",
    mobileRotate: "-rotate-3",
    place:
      "md:absolute md:z-30 md:w-[34%] md:bottom-[-8%] md:right-[10%] md:-rotate-7",
  },
  {
    key: "volunteering-day",
    caption: "PHOTO — team volunteering day",
    stripe: "#eaf6f8 0px, #eaf6f8 14px, #c9e9ee 14px, #c9e9ee 28px",
    aspect: "aspect-[4/5]",
    mobileRotate: "rotate-2",
    place:
      "md:absolute md:z-0 md:w-[30%] md:bottom-[6%] md:left-[-6%] md:rotate-6",
  },
];

function ScatteredPhotoPrint({ photo }: { photo: ScatteredPhoto }) {
  return (
    <figure
      className={`${photo.place} ${photo.mobileRotate} rounded-[10px] bg-[#fffdf8] p-2 pb-3 shadow-[var(--shadow-lift)] transition-[transform,box-shadow] duration-300 ease-out hover:z-40 hover:scale-[1.06] hover:shadow-[0_24px_48px_-14px_rgba(78,42,132,0.38)]`}
    >
      <div className={`${photo.aspect} overflow-hidden rounded-[4px]`}>
        {photo.src ? (
          <img
            src={photo.src}
            alt={photo.alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `repeating-linear-gradient(135deg, ${photo.stripe})`,
            }}
          />
        )}
      </div>
      {photo.caption && (
        <figcaption className="pt-1.5 text-center font-mono text-[10px] text-foreground/55">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden px-5 pt-20 pb-24 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-6rem] left-1/2 h-100 w-150 -translate-x-1/2 opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, #f4eefa 0%, #fef1de 60%, transparent 80%)",
          }}
        />

        <div className="relative mx-auto max-w-350 text-center">
          <h1 className="mb-5 text-[2.8rem] font-extrabold tracking-tight text-foreground">
            About UISAC
          </h1>
          <p className="mx-auto max-w-[60ch] text-lg leading-relaxed text-foreground/72">
            The Northwestern International Student Advancement and Advocacy
            Project (UISAC) is a student-led organization dedicated to
            supporting international students.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-bold">
            <a
              href="#who-we-are"
              className="rounded-full border-[1.5px] border-[#4e2a84]/20 px-4 py-2 no-underline transition hover:bg-[#4e2a84]/8"
            >
              Who we are
            </a>
            <a
              href="#mission"
              className="rounded-full border-[1.5px] border-[#4e2a84]/20 px-4 py-2 no-underline transition hover:bg-[#4e2a84]/8"
            >
              Mission &amp; vision
            </a>
            <a
              href="#acknowledgment"
              className="rounded-full border-[1.5px] border-[#4e2a84]/20 px-4 py-2 no-underline transition hover:bg-[#4e2a84]/8"
            >
              Sponsor
            </a>
          </div>
        </div>

        <div
          id="who-we-are"
          className="relative mx-auto mt-20 grid max-w-350 scroll-mt-6 grid-cols-1 items-center gap-16 md:grid-cols-2"
        >
          <div>
            <h2 className="mb-6 text-[2rem] font-extrabold text-foreground">
              Founded in 2025, by students, for students
            </h2>
            <p className="mb-4.5 text-[17px] leading-relaxed text-foreground/75">
              UISAC has grown into a vibrant community hub. We understand the
              complexities of moving to a new country for education, and we
              strive to make that transition as smooth as possible.
            </p>
            <p className="text-[17px] leading-relaxed text-foreground/75">
              Our team consists of students from over 30 different countries,
              bringing a wealth of diverse perspectives and experiences to our
              advocacy work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:relative md:block md:h-130 md:gap-0">
            {scatteredPhotos.map((photo) => (
              <ScatteredPhotoPrint key={photo.key} photo={photo} />
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="scroll-mt-6 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-350">
          <div className="mb-12 text-center">
            <h2 className="mx-auto max-w-[32ch] text-[2rem] font-extrabold text-foreground">
              Guiding our every step is a commitment to every international
              student
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative -rotate-1 md:mt-6">
              <span
                aria-hidden="true"
                className="tape absolute -top-3 left-10 rotate-[-5deg] bg-[#4fb2c4]/70"
              />
              <div className="rounded-[1.75rem] bg-[#f4eefa] p-9 shadow-[var(--shadow-soft)]">
                <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#4e2a84] text-[#fffdf8]">
                  <Target size={22} strokeWidth={2.25} />
                </span>
                <h3 className="mb-3.5 text-2xl font-extrabold text-foreground">
                  Our mission
                </h3>
                <p className="text-base leading-relaxed text-foreground/75">
                  To empower international students by providing
                  comprehensive support services, advocating for their rights
                  and needs within the university system, and fostering a
                  welcoming, inclusive community where diversity is
                  celebrated as a core strength.
                </p>
              </div>
            </div>
            <div className="relative rotate-1">
              <span
                aria-hidden="true"
                className="tape absolute -top-3 right-10 rotate-[6deg] bg-[#ff7a5c]/70"
              />
              <div className="rounded-[1.75rem] bg-[#fef1de] p-9 shadow-[var(--shadow-soft)]">
                <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#f6b93b] text-[#3a2705]">
                  <Eye size={22} strokeWidth={2.25} />
                </span>
                <h3 className="mb-3.5 text-2xl font-extrabold text-foreground">
                  Our vision
                </h3>
                <p className="text-base leading-relaxed text-foreground/75">
                  A university environment where international students not
                  only succeed academically but also feel secure,
                  represented, and fully connected to campus life and
                  opportunity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="acknowledgment"
        className="mx-auto max-w-300 scroll-mt-6 px-5 py-20 text-center lg:px-8"
      >
        <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#ff7a5c] text-[#3d1408]">
          <HeartHandshake size={22} strokeWidth={2.25} />
        </span>
        <h2 className="mb-5 text-[2.2rem] font-extrabold text-foreground">
          Thank you to our sponsor
        </h2>
        <p className="mx-auto mb-12 max-w-[60ch] text-[17px] leading-relaxed text-foreground/72">
          We extend our deepest appreciation to our primary sponsor for their
          unwavering support and commitment to international education.
        </p>
        <div className="grid grid-cols-1 items-center gap-10 rounded-[2rem] bg-[#f4eefa] p-10 text-left shadow-[var(--shadow-soft)] sm:grid-cols-3">
          <div className="rounded-[1.5rem] border-[1.5px] border-border bg-card p-8 text-center">
            <p className="m-0 text-[15px] font-extrabold tracking-wide">
              BUFFETT
              <br />
              INSTITUTE
            </p>
          </div>
          <div className="sm:col-span-2">
            <h3 className="mb-3 text-2xl font-extrabold text-foreground">
              The Buffett Institute for Global Affairs
            </h3>
            <p className="text-base leading-relaxed text-foreground/75">
              Their generous contribution has enabled us to launch critical
              advocacy initiatives, host community-building events, and
              provide essential resources to students from around the globe.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
