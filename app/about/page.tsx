import { Target, Eye, HeartHandshake } from "lucide-react";

type ScatteredPhoto = {
  key: string;
  src: string;
  alt: string;
  aspect: string;
  // Scrapbook look: each print gets its own tilt, size and vertical offset.
  // Sizes stay inside their own grid cell so prints never cover each other.
  frame: string;
};

const scatteredPhotos: ScatteredPhoto[] = [
  {
    key: "group",
    src: "/images/about.jpg",
    alt: "UISAC members gathered together as a community",
    aspect: "aspect-[4/5]",
    frame: "w-full -rotate-3",
  },
  {
    key: "rock",
    src: "/images/rock.JPG",
    alt: "The Rock on campus, painted with flags from around the world",
    aspect: "aspect-square",
    frame: "w-[88%] justify-self-end rotate-[4deg] lg:mt-10",
  },
  {
    key: "fest",
    src: "/images/fest.JPG",
    alt: "Students gathered for a campus fest on the lakefill",
    aspect: "aspect-[5/4]",
    frame: "w-[92%] self-start -rotate-2 lg:-mt-4",
  },
  {
    key: "lounge",
    src: "/images/lobby.jpg",
    alt: "UISAC members meeting in the lounge",
    aspect: "aspect-[4/5]",
    frame: "w-full justify-self-end rotate-3 lg:mt-6",
  },
];

function ScatteredPhotoPrint({ photo }: { photo: ScatteredPhoto }) {
  return (
    <figure
      className={`${photo.frame} relative rounded-[10px] bg-[#fffdf8] p-2 pb-3 shadow-[var(--shadow-lift)] transition-[transform,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.04] hover:shadow-[0_24px_48px_-14px_rgba(78,42,132,0.38)]`}
    >
      <div className={`${photo.aspect} overflow-hidden rounded-[4px]`}>
        <img
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-cover"
        />
      </div>
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
          <h1 className="font-display mb-5 text-[2.3rem] font-bold tracking-tight text-foreground sm:text-[2.9rem]">
            About UISAC
          </h1>
          <p className="mx-auto max-w-[60ch] text-lg leading-relaxed text-foreground/72">
            The Undergraduate International Students Advancement Council
            (UISAC) is a student-led organization dedicated to supporting
            international students in every aspect of their lives.
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
          className="relative mx-auto mt-20 grid max-w-350 scroll-mt-6 grid-cols-1 items-center gap-16 lg:grid-cols-2"
        >
          <div>
            <h2 className="font-display mb-6 text-[1.75rem] font-bold text-foreground sm:text-[2.1rem]">
              Founded in 2025, by students, for students
            </h2>
            <p className="mb-4.5 text-[17px] leading-relaxed text-foreground/75">
              UISAC has grown into a vibrant community hub. We understand the
              complexities of moving to a new country for education, leaving
              all the familiar behind. That is why we strive to make that
              transition as smooth as possible.
            </p>
            <p className="text-[17px] leading-relaxed text-foreground/75">
              Our team consists of students from over 30 countries, bringing a
              wealth of diverse perspectives and experiences to our advocacy
              and community initiatives.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-4 lg:grid-cols-2 lg:gap-6">
            {scatteredPhotos.map((photo) => (
              <ScatteredPhotoPrint key={photo.key} photo={photo} />
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="scroll-mt-6 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-350">
          <div className="mb-12 text-center">
            <h2 className="font-display mx-auto max-w-[32ch] text-[1.75rem] font-bold text-foreground sm:text-[2.1rem]">
              Guiding our every step is a commitment to every international
              student
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative md:mt-6">
              <span
                aria-hidden="true"
                className="tape tape-lg absolute -top-3 left-10 bg-[#4fb2c4]/70"
              />
              <div className="wobble-hover rounded-[1.75rem] bg-[#f4eefa] p-7 shadow-[var(--shadow-soft)] sm:p-9">
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
            <div className="relative">
              <span
                aria-hidden="true"
                className="tape tape-lg absolute -top-3 right-10 bg-[#ff7a5c]/70"
              />
              <div className="wobble-hover rounded-[1.75rem] bg-[#fef1de] p-7 shadow-[var(--shadow-soft)] sm:p-9">
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
        <h2 className="font-display mb-5 text-[1.85rem] font-bold text-foreground sm:text-[2.2rem]">
          Thank you to our sponsor
        </h2>
        <p className="mx-auto mb-12 max-w-[60ch] text-[17px] leading-relaxed text-foreground/72">
          We extend our deepest appreciation to our primary sponsor for their
          unwavering support and commitment to international education.
        </p>
        <div className="grid grid-cols-1 items-center gap-8 rounded-[2rem] bg-[#f4eefa] p-6 text-left shadow-[var(--shadow-soft)] sm:grid-cols-3 sm:gap-10 sm:p-10">
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
