/// <reference path="protonwrapper.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module BattleSFXFunctions
      {
        export function particleTest(props: Rance.Templates.SFXParams)
        {
          var particleContainer = new PIXI.ParticleContainer();
          var proton = new ProtonWrapper(props.renderer, particleContainer);

          var emitter = new Proton.BehaviourEmitter();
          emitter.rate = new Proton.Rate(
            new Proton.Span(50, 50), // particles per emit
            new Proton.Span(3, 3) // time between emits
          );
          emitter.p.x = props.width / 2;
          emitter.p.y = props.height / 2;

          // emitter.addInitialize(new Proton.Mass(1));
          emitter.addInitialize(new Proton.Life(3, 3));

          proton.addEmitter(emitter);

          function animate()
          {
            var elapsedTime = Date.now() - startTime;

            proton.update();

            if (elapsedTime < props.duration)
            {
              requestAnimationFrame(animate);
            }
            else
            {
              proton.destroy();
              props.triggerEnd();
            }
          }

          props.triggerStart(particleContainer);

          var startTime = Date.now();
          animate();
        }
      }
    }
  }
}
